const _ = require("underscore")

let mongoose = require("../lib/db")

const User = require("../models/user")
const Image = require("../models/image")
const Word = require("../models/word")
const ChoiceSet = require("../models/choiceSet")
const Question = require("../models/question")
const Passage = require("../models/passage")

const choiceSetMocks = require("../gql/tests/mocks/choiceSet").mocks
const imageMocks = require("../gql/tests/mocks/image").mocks
const userMocks = require("../gql/tests/mocks/user").mocks
const wordMocks = require("../gql/tests/mocks/word").mocks
const questionMocks = require("../gql/tests/mocks/question").mocks
const passageMocks = require("../gql/tests/mocks/passage").mocks

const collections = [
  { model: ChoiceSet, mocks: choiceSetMocks },
  { model: User, mocks: userMocks },
  { model: Word, mocks: wordMocks },
  { model: Image, mocks: imageMocks },
  { model: Question, mocks: questionMocks },
  { model: Passage, mocks: passageMocks }
]

let db = mongoose()

const seedCollections = async () => {
  const docs = _.flatten(
    collections.map(d => d.mocks.map(m => new d.model(m).save()))
  )
  return Promise.all(docs)
}

const seedDb = async (close = false) => {
  try {
    await clearCollections()
    await seedCollections()
  } catch (e) {
    console.log(e)
  }

  if (close) {
    process.exit(0)
  }
  return
}

const clearCollections = async () =>
  Promise.all(collections.map(c => c.model.remove()))

module.exports = { seedDb }
