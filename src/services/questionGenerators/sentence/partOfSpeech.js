const { sample, without, values, find, range } = require("underscore")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

const PART_OF_SPEECH = {
  PRP: { singular: "personal pronoun", plural: "personal pronouns" },
  VBD: { singular: "verb, past tense", plural: "verbs, past tense" },
  JJ: { singular: "adjective", plural: "adjectives" },
  NN: { singular: "noun", plural: "nouns" },
  NNS: { singular: "noun, plural", plural: "nouns, plural" },
  VB: { singular: "verb, base form", plural: "verbs, base form" },
  VBN: { singular: "verb, past participle", plural: "verbs, past participle" },
  IN: {
    singular: "preposition or subordinating conjunction",
    plural: "preposition or subordinating conjunctions"
  },
  DT: { singular: "determiner", plural: "determiners" },
  JJS: {
    singular: "adjective, superlative",
    plural: "adjectives, superlative"
  },
  NNP: { singular: "proper noun, singular", plural: "proper nouns, singular" },
  POS: { singular: "possessive ending", plural: "possessive endings" },
  NNPS: { singular: "proper noun, plural", plural: "proper nouns, plural" },
  RB: { singular: "adverb", plural: "adverbs" },
  CC: {
    singular: "coordinating conjunctions",
    plural: "coordinating conjunctions"
  },
  MD: "modals"
}

const regular = (passage, sources) => {
  const TYPE = "Word in Passage to POS"
  const { focusWordIndices, tagged } = passage
  const questions = []

  focusWordIndices.forEach(idx => {
    const prompt = condensePrompt(
      tagged.map((word, idx2) => {
        let params = { value: word.value }
        if (idx === idx2) {
          params.highlight = true
        }
        return params
      })
    )
    const value = PART_OF_SPEECH[tagged[idx].tag]
    const answer = [{ value, prefill: false }]
    const redHerrings = sample(without(values(PART_OF_SPEECH), value), 5)

    return questions.push({ TYPE, prompt, answer, redHerrings, sources })
  })

  return questions
}

const reversed = (passage, sources) => {
  const TYPE = "Word in Passage to POS (reverse)"
  const { focusWordIndices, tagged } = passage
  const questions = []

  const pos = sample(tagged.filter(t => t.tag !== undefined)).tag // TODO - could be null?
  if (!PART_OF_SPEECH[pos]) {
    return []
  }
  const correct = t => t.tag == pos
  const posCount = tagged.filter(correct).length
  const answerCount = sample(range(1, Math.min(3, posCount) + 1))

  const value = `Find ${answerCount} - ${
    PART_OF_SPEECH[pos][answerCount === 1 ? "singular" : "plural"]
  }`
  const prompt = [{ value, highlight: false }]

  const interactive = condenseInteractive(
    tagged.map(t => ({
      value: t.value,
      correct: correct(t)
    }))
  )

  return [{ TYPE, prompt, interactive, answerCount, sources }]
}

module.exports = (passage, passages, sources) =>
  regular(passage, sources).concat(reversed(passage, sources))
