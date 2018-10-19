const { shuffle, union, flatten, extend } = require("underscore")

const wordToDef = require("./wordToDef")
const wordToRoots = require("./wordToRoots")
const wordToSyn = require("./wordToSyn")
const wordToTag = require("./wordToTag")
const wordToImg = require("./wordToImg")
const wordToChars = require("./wordToChars")

const WordModel = require("../../../models/word")

const TYPES = {
  WORD_TO_DEF: { fn: wordToDef, difficulty: 1 },
  WORD_TO_ROOTS: { fn: wordToRoots, difficulty: 2 },
  WORD_TO_SYN: { fn: wordToSyn, difficulty: 4 },
  WORD_TO_TAG: { fn: wordToTag, difficulty: 4 },
  /*WORD_TO_IMG: {fn: wordToImg, difficulty: },*/
  WORD_TO_CHARS: { fn: wordToChars, difficulty: 7 }
}

const getRedHerringDocs = (filterId, docs) => {
  docs = docs.filter(doc => !doc._id.equals(filterId))
  docs = shuffle(docs)
  return union(
    docs.filter(doc => doc.isDecomposable).slice(0, 5),
    docs.filter(doc => !doc.isDecomposable).slice(0, 5)
  )
}

module.exports = async (doc, docs, TYPE) => {
  const redHerringDocs = getRedHerringDocs(doc._id, docs)
  const word = { id: doc._id, value: doc.value }
  const sources = { word }

  const generate = TYPE =>
    TYPES[TYPE].fn(doc, redHerringDocs).map(q =>
      extend(q, { TYPE, sources, difficulty: TYPES[TYPE].difficulty })
    )

  const questions = await (TYPE
    ? generate(TYPE)
    : Promise.all(Object.keys(TYPES).map(generate)))

  return flatten(questions)
}
