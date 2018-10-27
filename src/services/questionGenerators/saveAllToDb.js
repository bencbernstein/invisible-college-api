const { last, flatten } = require("underscore")

require("../../lib/db")()

const WordModel = require("../../models/word")
const PassageModel = require("../../models/passage")
const QuestionModel = require("../../models/question")

const wordQuestions = require("./word/index")
const { passageQuestions } = require("./sentence/index")
const onboardingWords = require("../../gql/data/onboardingWords")

const createWordQuestions = async () => {
  const docs = await WordModel.find()
  return flatten(await Promise.all(docs.map(d => wordQuestions(d, docs))))
}

const createPassageQuestions = async () => {
  const docs = await PassageModel.find({ status: "enriched" })
  return flatten(await Promise.all(docs.map(d => passageQuestions(d, docs))))
}

exports.generate = async () => {
  try {
    await QuestionModel.remove({ passageOrWord: "word" })
    // const passageQs = await createPassageQuestions()
    // passageQs.forEach(q => (q.passageOrWord = "passage"))
    const wordQs = await createWordQuestions()
    wordQs.forEach(q => (q.passageOrWord = "word"))
    await QuestionModel.create(wordQs)
  } catch (error) {
    console.log(error)
  }

  process.exit(0)
}
