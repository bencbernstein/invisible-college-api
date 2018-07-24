const _ = require("underscore")

let mongoose = require("../lib/db")

const User = require("../models/user")
const Text = require("../models/text")
const Word = require("../models/word")
const ChoiceSet = require("../models/choiceSet")

const choiceSetMocks = require("../gql/tests/mocks/choiceSet").mocks
const textMocks = require("../gql/tests/mocks/text").mocks
const userMocks = require("../gql/tests/mocks/user").mocks
const wordMocks = require("../gql/tests/mocks/word").mocks

const collections = [
  { model: ChoiceSet, mocks: choiceSetMocks },
  { model: User, mocks: userMocks },
  { model: Word, mocks: wordMocks },
  { model: Text, mocks: textMocks }
]

let db = mongoose()

const seedCollections = async () => {
  const docs = _.flatten(
    collections.map(d => d.mocks.map(m => new d.model(m).save()))
  )
  return Promise.all(docs)
}

const seedDb = async (close = false) => {
  await clearCollections()
  await seedCollections()
  if (close) {
    process.exit(0)
  }
  return
}

const clearCollections = async () =>
  Promise.all(collections.map(c => c.model.remove()))

module.exports = { seedDb }
