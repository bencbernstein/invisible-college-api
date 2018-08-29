const ChoiceSetModel = require("../../../models/choiceSet")
const WordModel = require("../../../models/word")
const _ = require("underscore")

const coinflip = () => Math.random() > 0

const question = async (passage, word, idx) => {
  const { wordId, choiceSetId, isFocusWord, value } = word

  const MAKE_WRONG = coinflip()
  let params = {}
  let followUpParams = {}
  let herring, herrings

  if (wordId && isFocusWord) {
    const wordDoc = await WordModel.findById(wordId)
    const herringDocs = await WordModel.redHerring(wordDoc)
    herrings = herringDocs.map(h => h.value)
  } else if (choiceSetId && isFocusWord) {
    const choiceSet = await ChoiceSetModel.findById(choiceSetId)
    herrings = _.without(choiceSet.choices, value)
  } else {
    return
  }

  herring = _.sample(herrings)

  params.prompt = passage.map((word, idx2) => ({
    value: idx === idx2 && MAKE_WRONG ? herring : word.value,
    highlight: idx === idx2
  }))

  params.answer = [{ prefill: false, value: MAKE_WRONG ? "FALSE" : "TRUE" }]
  params.redHerrings = [MAKE_WRONG ? "TRUE" : "FALSE"]

  if (!MAKE_WRONG) {
    return params
  }

  followUpParams.answer = params.prompt.map(p => ({
    value: p.value,
    prefill: !p.highlight
  }))

  followUpParams.redHerrings = herrings

  return [params, followUpParams]
}

const questions = async passage => {
  const flattened = _.flatten(passage.tagged)
  const promises = flattened.map((word, idx) => question(flattened, word, idx))
  return Promise.all(promises)
}

module.exports = doc => {
  const promises = _.flatten(
    doc.passages
      .map(passage => _.flatten(passage.tagged))
      .map(flattened =>
        flattened.map((word, idx) => question(flattened, word, idx))
      )
  )
  return Promise.all(promises)
}
