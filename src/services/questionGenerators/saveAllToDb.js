const _ = require("underscore")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")

const ImageModel = require("../../models/image")

const generateQuestionsForWord = require("./word/index")
const generateQuestionsForText = require("./sentence/index")

exports.generate = async category => {
  const query = category ? { categories: category } : {}
  const texts = await TextModel.find(query, { _id: 1, name: 1 })
  const words = await WordModel.find(query, { _id: 1, value: 1 })

  let wordCounter = 0
  let textCounter = 0

  for (const text of texts) {
    textCounter += 1
    console.log(
      `${textCounter}/${texts.length} Creating questions for text: ${text.name}`
    )

    const questionsForText = _.compact(
      _.flatten(await generateQuestionsForText(text._id, category))
    )

    try {
      await QuestionModel.create(questionsForText)
    } catch (e) {
      console.log(e.message)
    }
  }

  for (const word of words) {
    wordCounter += 1
    console.log(
      `${wordCounter}/${words.length} Creating questions for word: ${
      word.value
      }`
    )

    const questionsForWord = _.compact(
      _.flatten(await generateQuestionsForWord(word._id, category))
    )

    try {
      await QuestionModel.create(questionsForWord)
    } catch (e) {
      console.log(e.message)
    }
  }

  return
}
