const { sample, without, values, find, range } = require("underscore")

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

const regular = passage => {
  const questions = []

  passage.focusWordIndices.forEach(idx => {
    const prompt = passage.tagged.map((word, idx2) => {
      let params = { value: word.value }
      if (idx === idx2) {
        params.highlight = true
      }
      return params
    })
    const value = PART_OF_SPEECH[passage.tagged[idx].tag]
    const answer = [{ value, prefill: false }]
    const redHerrings = sample(without(values(PART_OF_SPEECH), value), 5)
    return questions.push({ prompt, answer, redHerrings })
  })

  return questions
}

const reversed = passage => {
  const questions = []

  const pos = sample(passage.tagged.filter(t => t.tag !== undefined)).tag // TODO - could be null?
  const correct = t => t.tag == pos
  const posCount = passage.tagged.filter(correct).length
  const answerCount = sample(range(1, Math.min(3, posCount) + 1))

  const prompt = [
    { value: `Find ${answerCount} - ${PART_OF_SPEECH[pos]}`, highlight: false }
  ]

  const interactive = passage.tagged.map(t => ({
    value: t.value,
    correct: correct(t)
  }))

  return [{ prompt, interactive, answerCount }]
}

module.exports = (passage, passages, reverse) =>
  reverse ? reversed(passage) : regular(passage)
