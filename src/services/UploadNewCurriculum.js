const fs = require("fs")
const _ = require("underscore")

require("../lib/db")()

const Text = require("../models/text")
const Word = require("../models/word")
const ChoiceSet = require("../models/choiceSet")
const Image = require("../models/image")
const Question = require("../models/question")
const QuestionSequence = require("../models/questionSequence")

const choiceSets = require("./newCurriculum/choiceSets")
const words = require("./newCurriculum/words")
const texts = require("./newCurriculum/texts")

const { generate } = require("./questionGenerators/saveAllToDb")

const CATEGORY = "microeconomics"

const images = [
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/demand.jpg"),
    words: [CATEGORY, "demand"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/currency.jpg"),
    words: [CATEGORY, "currency"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/equilibrium.jpg"),
    words: [CATEGORY, "equilibrium"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/labour.jpg"),
    words: [CATEGORY, "labour"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/market.jpg"),
    words: [CATEGORY, "market"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/service.jpg"),
    words: [CATEGORY, "service"]
  },
  {
    buf: fs.readFileSync(__dirname + "/newCurriculum/images/trade.jpg"),
    words: [CATEGORY, "trade"]
  }
]

const collections = [
  { model: ChoiceSet, mocks: choiceSets },
  { model: Word, mocks: words },
  { model: Text, mocks: texts },
  { model: Question, mocks: [] },
  { model: QuestionSequence, mocks: [] },
  { model: Image, mocks: images }
]

const TYPES = [
  "PART_OF_SPEECH",
  "SWAP_LEMMA",
  "SENTENCE_TO_TRUTH",
  "WORD_TO_DEF",
  "WORD_TO_ROOTS",
  "WORD_TO_SYN",
  "WORD_TO_TAG",
  "WORD_TO_IMG"
]

const clearCollections = async () => {
  await Promise.all(
    collections.map(c => c.model.remove({ categories: CATEGORY }))
  )
  await Image.remove({ words: CATEGORY })
  return
}

const seedCollections = async () =>
  Promise.all(
    _.flatten(collections.map(d => d.mocks.map(m => new d.model(m).save())))
  )

const generateSequence = async () => {
  const questions = await Question.find(
    { categories: CATEGORY },
    { _id: 1, TYPE: 1 }
  )
  let ids = []

  TYPES.forEach(type => {
    const filtered = questions.filter(q => q.TYPE === type)
    console.log(`# of ${type} questions: ${filtered.length}`)
    ids = ids.concat(filtered.slice(0, 14).map(f => f._id))
  })

  const shuffled = _.shuffle(ids)
  return QuestionSequence.create({ name: CATEGORY, questions: shuffled })
}

const createCurriculum = async () => {
  await clearCollections()
  await seedCollections()
  await generate(CATEGORY)
  await generateSequence(CATEGORY)
  console.log(CATEGORY + " curriculum successfully created.")
}

createCurriculum()
