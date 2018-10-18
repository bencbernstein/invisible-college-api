const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const gql = require("graphql-tag")

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")

const text = require("./mocks/text").mock
const word = require("./mocks/word").mock

const fragment = `
  id
  TYPE
  prompt {
    value
    hide
    highlight
  }
  answer {
    value
    prefill
  }
  redHerrings
  sources {
    text {
      id
      value
    }
    word {
      id
      value
    }
  }
`

describe("questions", () => {
  beforeEach(async () => await seedDb())

  it("returns questions", async function() {
    const query = `
      query {
        questions {
          ${fragment}
        }
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { questions } = result.data

    chai.assert(Array.isArray(questions))
    chai.assert.notEqual(questions.length, 0)
  })

  it("returns questions for a word", async function() {
    const query = `
      query {
        questionsForWord(id: "${word._id}") {
          ${fragment}
        }
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { questionsForWord } = result.data

    chai.assert(Array.isArray(questionsForWord))
    chai.assert.notEqual(questionsForWord.length, 0)
  })

  it("returns questions for a text", async function() {
    const query = `
      query {
        questionsForText(id: "${text._id}") {
          ${fragment}
        }
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { questionsForText } = result.data

    chai.assert(Array.isArray(questionsForText))
    chai.assert.notEqual(questionsForText.length, 0)
  })
})
