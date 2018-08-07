const _ = require("underscore")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")

const ImageModel = require("../../models/image")

const generateQuestionsForWord = require("./word/index")
const generateQuestionsForText = require("./sentence/index")

const generate = async () => {
  await QuestionModel.remove()

  const texts = await TextModel.find({}, { _id: 1, name: 1 })
  const words = await WordModel.find({}, { _id: 1, value: 1 })

  let wordCounter = 0
  let textCounter = 0

  for (const word of words) {
    wordCounter += 1
    console.log(
      `${wordCounter}/${words.length} Creating questions for word: ${
        word.value
      }`
    )

    const questionsForWord = _.compact(
      _.flatten(await generateQuestionsForWord(word._id))
    )

    try {
      await QuestionModel.create(questionsForWord)
    } catch (e) {
      console.log(e.message)
    }
  }

  for (const text of texts) {
    textCounter += 1
    console.log(
      `${textCounter}/${text.length} Creating questions for word: ${text.name}`
    )

    const questionsForText = _.compact(
      _.flatten(await generateQuestionsForText(text._id))
    )

    try {
      await QuestionModel.create(questionsForText)
    } catch (e) {
      console.log(e.message)
    }
  }
}

generate()
