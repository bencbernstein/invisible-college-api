const ChoiceSetModel = require("../../../models/choiceSet")
const WordModel = require("../../../models/word")
const { sample, without, flatten } = require("underscore")

const question = async (tagged, word, idx, makeWrong) => {
  const { wordId, choiceSetId, value } = word

  let params = {}
  let followUpParams = {}
  let reverseParams = {}
  let herring, herrings

  if (wordId) {
    const wordDoc = await WordModel.findById(wordId)
    const herringDocs = await WordModel.redHerring(wordDoc)
    herrings = herringDocs.map(h => h.value)
  } else {
    const choiceSet = await ChoiceSetModel.findById(choiceSetId)
    herrings = without(choiceSet.choices, value)
  }

  herring = sample(herrings)

  params.prompt = tagged.map((word, idx2) => {
    if (word.isSentenceConnector) {
      return word
    }
    const params = { value: idx === idx2 && makeWrong ? herring : word.value }
    if (idx === idx2) {
      params.highlight = true
    }
    return params
  })
  params.answer = [{ prefill: false, value: makeWrong ? "FALSE" : "TRUE" }]
  params.redHerrings = [makeWrong ? "TRUE" : "FALSE"]

  if (!makeWrong) {
    return params
  }

  followUpParams.prompt = params.prompt.map((p, idx2) => {
    const elem = { value: idx === idx2 ? value : p.value }
    if (p.highlight) {
      elem.hide = true
    }
    return elem
  })
  followUpParams.answer = [{ value, prefill: false }]
  followUpParams.redHerrings = herrings

  reverseParams.prompt = [
    { value: "Find the wrong word in the passage.", highlight: false }
  ]
  reverseParams.interactive = params.prompt.map((p, idx2) => ({
    correct: idx === idx2,
    value: idx === idx2 ? sample(herrings) : p.value
  }))
  reverseParams.answerCount = 1

  return [params, followUpParams, reverseParams]
}

module.exports = async passage =>
  Promise.all(
    flatten(
      passage.tagged.map(
        (word, idx) =>
          !word.isUnfocused &&
          (word.wordId || word.choiceSetId) &&
          [true, false].map(bool => question(passage.tagged, word, idx, bool))
      )
    )
  )
