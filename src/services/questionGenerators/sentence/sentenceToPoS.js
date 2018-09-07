const _ = require("underscore")

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

module.exports = passage => {
  const questions = []

  const focusWordIndices = passage.tagged
    .map((word, idx) => word.isFocusWord && idx)
    .filter(idx => idx > -1)

  focusWordIndices.forEach(idx => {
    const prompt = passage.tagged.map((word, idx2) => {
      let params = { value: word.value }
      if (idx === idx2) {
        params.highlight = true
      }
      return params
    })
    const value = PART_OF_SPEECH[passage.tagged[idx].tag]
    const answer = [{ value, prefill: false }]
    const redHerrings = _.sample(_.without(_.values(PART_OF_SPEECH), value), 5)
    return questions.push({ prompt, answer, redHerrings })
  })

  return questions
}
