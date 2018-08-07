const _ = require("underscore")

const wordToDef = require("./wordToDef")
const wordToRoots = require("./wordToRoots")
const wordToSyn = require("./wordToSyn")
const wordToTag = require("./wordToTag")
const wordToImg = require("./wordToImg")

const WordModel = require("../../../models/word")

const TYPES = {
  WORD_TO_DEF: wordToDef,
  WORD_TO_ROOTS: wordToRoots,
  WORD_TO_SYN: wordToSyn,
  WORD_TO_TAG: wordToTag,
  WORD_TO_IMG: wordToImg
}

const getRedHerringDocs = async exclude =>
  _.flatten(
    await Promise.all([
      WordModel.find({
        _id: { $ne: exclude },
        isDecomposable: false
      }).limit(5),
      WordModel.find({
        _id: { $ne: exclude },
        isDecomposable: true
      }).limit(5)
    ])
  )

module.exports = async (id, TYPE, reverse) => {
  const doc = await WordModel.findById(id)
  const redHerringDocs = await getRedHerringDocs(id)

  let questions

  const params = [doc, redHerringDocs, reverse]

  const generate = async TYPE =>
    _.flatten(await TYPES[TYPE](...params)).map(q => _.extend({}, q, { TYPE }))

  if (TYPE) {
    questions = await generate(TYPE)
  } else {
    questions = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(questions))
  }

  const word = { id, value: doc.value }
  questions.forEach(q => (q.sources = { word }))

  return questions
}
