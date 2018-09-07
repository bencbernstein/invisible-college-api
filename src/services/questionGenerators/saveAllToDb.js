const _ = require("underscore")
const pos = require("pos")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const QuestionSequenceModel = require("../../models/questionSequence")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")
const CONNECTORS = _.flatten(
  require("../../lib/connectors").map(c => c.elements)
)

const wordQuestions = require("./word/index")

const {
  passageQuestions,
  additionalPassageQuestions
} = require("./sentence/index")

const createWordQuestions = async query => {
  const docs = await WordModel.find(query)

  const promises = docs.map(
    async doc => await wordQuestions(doc, docs, query.category)
  )

  return Promise.all(promises)
}

const createTextQuestions = async query => {
  let passages = _.flatten(
    (await TextModel.find({}, { passages: 1, _id: 0 })).map(t => t.passages)
  )
  passages = _.shuffle(passages.filter(p => p.isEnriched))

  // const additionalTextQs = generateAdditionalQuestionsForText(textQs)

  return Promise.all(
    passages.map(p => passageQuestions(p, passages, query.category))
  )
}

exports.generate = async category => {
  await QuestionModel.remove()
  await QuestionSequenceModel.remove()

  const query = category ? { categories: category } : {}

  let questions = _.flatten([
    await createWordQuestions(query),
    await createTextQuestions(query)
  ])

  questions = _.shuffle(questions)
  questions.forEach(q => console.log(q.TYPE))

  try {
    questions = await QuestionModel.create(questions)
    console.log("Succesfully created " + questions.length + " questions")
    const name = "test sequence"
    questions = questions.map(q => q._id)
    await QuestionSequenceModel.create({ name, questions })
    console.log("Succesfully created " + name)
  } catch (e) {
    console.log(e)
  }

  process.exit(0)
}
