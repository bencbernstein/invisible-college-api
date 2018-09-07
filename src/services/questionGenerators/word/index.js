const _ = require("underscore")

const wordToDef = require("./wordToDef")
const wordToRoots = require("./wordToRoots")
const wordToSyn = require("./wordToSyn")
const wordToTag = require("./wordToTag")
const wordToImg = require("./wordToImg")
const wordToChars = require("./wordToChars")

const WordModel = require("../../../models/word")

const TYPES = {
  WORD_TO_DEF: wordToDef,
  WORD_TO_ROOTS: wordToRoots,
  WORD_TO_SYN: wordToSyn,
  WORD_TO_TAG: wordToTag,
  WORD_TO_IMG: wordToImg,
  WORD_TO_CHARS: wordToChars
}

const getRedHerringDocs = (filterId, docs) => {
  docs = docs.filter(doc => !doc._id.equals(filterId))
  docs = _.shuffle(docs)
  return _.union(
    docs.filter(doc => doc.isDecomposable).slice(0, 5),
    docs.filter(doc => !doc.isDecomposable).slice(0, 5)
  )
}

const track = (date, idx) => console.log(`${idx}: ${new Date() - date}`)

module.exports = async (doc, docs, category, TYPE, reverse) => {
  const redHerringDocs = getRedHerringDocs(doc._id, docs)

  let questions

  const params = [doc, redHerringDocs, reverse]

  const generate = async TYPE =>
    _.flatten(await TYPES[TYPE](...params)).map(q =>
      _.extend({}, q, { TYPE, categories: category })
    )

  if (TYPE) {
    questions = await generate(TYPE)
  } else {
    questions = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(questions))
    /*console.log(doc.value)
    track(BEGINNING, 1)
    console.log(questions.map(q => q.TYPE))
    console.log("\n")*/
  }

  const word = { id: doc._id, value: doc.value }
  questions.forEach(q => (q.sources = { word }))

  return questions
}
