const { last, flatten, sample, chunk } = require("underscore")

require("../../lib/db")()

const WordModel = require("../../models/word")
const PassageModel = require("../../models/passage")
const QuestionModel = require("../../models/question")

const { wordQuestions, wordQuestionTypes } = require("./word/index")
const { passageQuestions } = require("./sentence/index")

const createPassageQuestions = async () => {
  const docs = await PassageModel.find({ status: "enriched" })
  return flatten(await Promise.all(docs.map(d => passageQuestions(d, docs))))
}

const CREATE_WORDS_QS = true
const CREATE_PASSAGE_QS = false

exports.generate = async () => {
  // await QuestionModel.remove({ passageOrWord: "" })

  const words = await WordModel.find()
  const passages = await PassageModel.find({ status: "enriched" })

  if (CREATE_WORDS_QS) {
    for (const TYPE of ["WORD_TO_IMG"] /*Object.keys(wordQuestionTypes)*/) {
      try {
        for (const group of chunk(words, 100)) {
          const promises = group.map(w =>
            wordQuestions(w, words, passages, TYPE)
          )
          const questions = flatten(await Promise.all(promises))
          questions.forEach(q => {
            q.passageOrWord = "word"
            // console.log(q)
          })
          console.log(`Creating ${questions.length} ${TYPE} questions.`)
          await QuestionModel.create(questions)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (CREATE_PASSAGE_QS) {
    try {
      const passage = passages.find(
        p => String(p._id) === "5bc158d027412a001faaa75a"
      )
      const promises = [passage].map(p => passageQuestions(p, passages))
      const questions = flatten(await Promise.all(promises))
      questions.forEach(q => {
        q.passageOrWord = "passage"
        console.log(q)
      })
      // console.log(`Creating ${questions.length} passage questions.`)
      // await QuestionModel.create(questions)
    } catch (error) {
      console.log(error)
    }
  }

  process.exit(0)
}
