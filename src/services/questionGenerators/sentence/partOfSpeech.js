const { sample, without, values, find, range } = require("underscore")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

const PART_OF_SPEECH = {
  PRP: "personal pronoun",
  VBD: "verb, past tense",
  JJ: "adjective",
  NN: "noun",
  NNS: "noun, plural",
  VB: "verb, base form",
  VBN: "verb, past participle",
  IN: "preposition or subordinating conjunction",
  DT: "determiner",
  JJS: "adjective, superlative",
  NNP: "proper noun, singular",
  POS: "possessive ending",
  NNPS: "proper noun, plural",
  RB: "adverb",
  CC: "coordinating conjunction",
  MD: "modal"
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

  const prompt = [
    { value: `Find ${answerCount} - ${PART_OF_SPEECH[pos]}`, highlight: false }
  ]

  const interactive = condenseInteractive(
    tagged.map(t => ({
      value: t.value,
      correct: correct(t)
    }))
  )

  return [{ TYPE, prompt, interactive, answerCount, sources }]
}

module.exports = (passage, passages, sources) => reversed(passage, sources) // regular(passage, sources).concat(reversed(passage, sources))
