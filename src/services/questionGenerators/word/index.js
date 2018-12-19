const { shuffle, union, flatten, extend, partition, get } = require("lodash")

const wordToDef = require("./wordToDef")
const wordToRoots = require("./wordToRoots")
const wordToSyn = require("./wordToSyn")
const wordToTag = require("./wordToTag")
const wordToImg = require("./wordToImg")
const wordToChars = require("./wordToChars")

const WordModel = require("../../../models/word")

const wordQuestionTypes = {
  WORD_TO_DEF: wordToDef,
  WORD_TO_ROOTS: wordToRoots,
  /*WORD_TO_SYN: wordToSyn,
  WORD_TO_TAG: wordToTag,*/
  WORD_TO_IMG: wordToImg,
  WORD_TO_CHARS: wordToChars
}

const getRedHerringDocs = (filterId, words) => {
  words = shuffle(words.filter(doc => !doc._id.equals(filterId)))
  words = partition(words, w => w.isDecomposable).map(arr => arr.slice(0, 5))
  return union(...words)
}

const getDaisyChain = (word, words, passages) => {
  const root = id => ({
    id,
    difficulty: get(words.find(d => d._id.equals(id)), "obscurity"),
    type: "word"
  })

  const imageOnCorrect = id => ({
    id,
    type: "image"
  })

  const factoidOnCorrect = ({ id, curriculumId }) => ({
    id,
    curriculumId,
    type: "passage",
    difficulty: get(
      passages.find(p => p._id.equals(id)),
      "difficulty",
      undefined
    )
  })

  return union(
    word.sharesRoot.map(root).filter(d => d.difficulty),
    word.images.map(imageOnCorrect),
    word.passages.map(factoidOnCorrect).filter(d => d.difficulty)
  )
}

const wordQuestions = async (word, words, passages, TYPE) => {
  const redHerrings = getRedHerringDocs(word._id, words)
  const sources = { word: { id: word._id, value: word.value } }
  const daisyChain = getDaisyChain(word, words, passages)
  return wordQuestionTypes[TYPE](word, redHerrings, sources, daisyChain)
}

module.exports = {
  wordQuestions,
  wordQuestionTypes
}
