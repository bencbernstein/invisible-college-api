const _ = require("underscore")

const posTranslation = {
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

module.exports = sentences =>
  sentences.map(sentence => {
    const focusWordIndices = sentence
      .map((word, idx) => (word.isFocusWord ? idx : undefined))
      .filter(e => e !== undefined)

    return focusWordIndices.map(focusWordidx => {
      let params = {}

      params.prompt = sentence.map((word, idx) => ({
        value: word.value,
        highlight: idx === focusWordidx
      }))

      const answer = sentence[focusWordidx].tag
      params.answer = [{ value: posTranslation[answer], prefill: false }]

      params.redHerrings = _.sample(
        _.without(_.values(posTranslation), posTranslation[answer]),
        5
      )

      return params
    })
  })
