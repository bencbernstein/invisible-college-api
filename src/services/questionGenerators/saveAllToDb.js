const _ = require("underscore")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const QuestionSequenceModel = require("../../models/questionSequence")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")

const generateQuestionsForWord = require("./word/index")

const {
  generateQuestionsForText,
  generateAdditionalQuestionsForText
} = require("./sentence/index")

exports.generate = async category => {
  await QuestionModel.remove()
  await QuestionSequenceModel.remove()

  const query = category ? { categories: category } : {}

  const texts = await TextModel.find(query, { _id: 1, name: 1 })
  const words = await WordModel.find(query, { _id: 1, value: 1 })

  const promises = texts.map(
    async text => await generateQuestionsForText(text._id, category)
  )

  const textQs = _.flatten(await Promise.all(promises))
  // const additionalTextQs = generateAdditionalQuestionsForText(textQs)

  const questions = await QuestionModel.create(textQs)

  await QuestionSequenceModel.create({
    name: "test sequence",
    questions: questions.map(q => q._id)
  })

  console.log("success")
  process.exit(0)

  /*for (const word of words) {
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

  return*/
}
