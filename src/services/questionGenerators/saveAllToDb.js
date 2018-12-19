const { last, flatten, sample, chunk } = require("underscore")

require("../../lib/db")()

const WordModel = require("../../models/word")
const PassageModel = require("../../models/passage")
const QuestionModel = require("../../models/question")

const { wordQuestions, wordQuestionTypes } = require("./word/index")
const { passageQuestions } = require("./sentence/index")

const ZOOLOGY_ID = "5c12a6d47c95465e4f521903"

exports.generate = async () => {
  const query = { enriched: true, curriculumId: ZOOLOGY_ID }
  const docs = await PassageModel.find(query)
  let questions = await Promise.all(docs.slice(0, 1).map(passageQuestions))
  questions = flatten(questions)
  return process.exit(0)
}

exports.generateWordQuestions = async () => {
  // await QuestionModel.remove({ passageOrWord: "word" })
  const words = await WordModel.find()
  const passages = await PassageModel.find()

  const ALL = true
  const TYPES = ALL ? Object.keys(wordQuestionTypes) : ["WORD_TO_IMG"]

  for (const TYPE of TYPES) {
    try {
      for (const group of chunk(
        words.filter(word => word.value === "liver"),
        100
      )) {
        //for (const group of chunk(words, 100)) {
        const promises = group.map(w => wordQuestions(w, words, passages, TYPE))
        const questions = flatten(await Promise.all(promises))
        questions.forEach(q => {
          q.passageOrWord = "word"
          if (q.daisyChain.length) {
            console.log(q)
          }
        })
        console.log(`Creating ${questions.length} ${TYPE} questions.`)
        // await QuestionModel.create(questions)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return process.exit(0)
}
