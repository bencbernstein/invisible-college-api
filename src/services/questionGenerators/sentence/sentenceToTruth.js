const ChoiceSetModel = require("../../../models/choiceSet")
const WordModel = require("../../../models/word")
const _ = require("underscore")

const coinflip = () => Math.random() > 0

const question = async (tagged, word, idx) => {
  const { wordId, choiceSetId, value } = word

  const MAKE_WRONG = coinflip()
  let params = {}
  let followUpParams = {}
  let herring, herrings

  if (wordId) {
    const wordDoc = await WordModel.findById(wordId)
    const herringDocs = await WordModel.redHerring(wordDoc)
    herrings = herringDocs.map(h => h.value)
  } else {
    const choiceSet = await ChoiceSetModel.findById(choiceSetId)
    herrings = _.without(choiceSet.choices, value)
  }

  herring = _.sample(herrings)

  params.prompt = tagged.map((word, idx2) => {
    if (word.isSentenceConnector) {
      return word
    }
    const params = { value: idx === idx2 && MAKE_WRONG ? herring : word.value }
    if (idx === idx2) {
      params.highlight = true
    }
    return params
  })
  params.answer = [{ prefill: false, value: MAKE_WRONG ? "FALSE" : "TRUE" }]
  params.redHerrings = [MAKE_WRONG ? "TRUE" : "FALSE"]

  if (!MAKE_WRONG) {
    return params
  }

  followUpParams.answer = params.prompt.map((p, idx2) => {
    if (p.isSentenceConnector) {
      return p
    }
    return { value: idx === idx2 ? value : p.value, prefill: !p.highlight }
  })

  followUpParams.redHerrings = herrings
  return [params, followUpParams]
}

module.exports = async passage =>
  Promise.all(
    passage.tagged.map(
      (word, idx) =>
        !word.isUnfocused &&
        (word.wordId || word.choiceSetId) &&
        question(passage.tagged, word, idx)
    )
  )
