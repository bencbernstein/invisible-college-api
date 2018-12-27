const {
  sample,
  sampleSize,
  without,
  values,
  find,
  range,
  get
} = require("lodash")

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
  MD: {
    singular: "modal",
    plural: "modal"
  }
}

const singulars = Object.values(PART_OF_SPEECH).map(({ singular }) => singular)

const regular = (passage, sources) => {
  const TYPE = "Word in Passage to POS"
  const questions = []

  passage.focusWordIndices().forEach(idx => {
    let prompt = passage.tagged.map((word, idx2) => {
      if (word.isSentenceConnector) return { isSentenceConnector: true }
      let params = { value: word.value }
      if (idx === idx2) params.highlight = true
      return params
    })
    prompt = condensePrompt(prompt)

    const value = get(PART_OF_SPEECH[passage.tagged[idx].pos], "singular")
    const answer = [{ value, prefill: false }]
    const redHerrings = sampleSize(singulars, 5)

    return questions.push({ TYPE, prompt, answer, redHerrings, sources })
  })
  questions.forEach(q => console.log(q))
  return questions
}

const reversed = (passage, sources) => {
  const TYPE = "Word in Passage to POS (reverse)"
  const focusWordIndices = passage.focusWordIndices()
  const questions = []

  const pos = sample(passage.tagged.filter(t => t.pos)).pos

  if (!PART_OF_SPEECH[pos]) return []
  const correct = t => get(t, "pos") === pos

  const posCount = passage.tagged.filter(correct).length
  const answerCount = sample(range(1, Math.min(3, posCount) + 1))

  const value = `Find ${answerCount} ${
    PART_OF_SPEECH[pos][answerCount === 1 ? "singular" : "plural"]
  }`
  const prompt = [{ value, highlight: false }]

  const interactive = condenseInteractive(
    passage.tagged.map(t => ({
      value: t.value,
      correct: correct(t)
    }))
  )

  return [{ TYPE, prompt, interactive, answerCount, sources }]
}

module.exports = (passage, sources) =>
  reversed(passage, sources).concat(reversed(passage, sources))
