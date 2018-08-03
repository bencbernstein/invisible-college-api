const _ = require("underscore")

const RED_HERRINGS = [
  "DT",
  "JJ",
  "NN",
  "NNS",
  "WDT",
  "VBZ",
  "VB",
  "CC",
  "RB",
  "DT",
  "IN",
  "NNP",
  "VBG"
]

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
      params.answer = [{ value: answer, prefill: false }]

      params.redHerrings = _.sample(_.without(RED_HERRINGS, answer), 5)

      return params
    })
  })
