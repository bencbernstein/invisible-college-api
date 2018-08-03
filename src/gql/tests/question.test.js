const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")

const word = require("./mocks/word").mock

describe("questions", () => {
  beforeEach(async () => await seedDb())

  it("returns questions for a word", async function() {
    const query = `
      query {
        questionsForWord(id: "${word._id}") {
          TYPE
          prompt {
            value
            highlight
          }
          answer {
            value
            prefill
          }
          redHerrings
          sources {
            word
          }
        }
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { questionsForWord } = result.data

    chai.assert(Array.isArray(questionsForWord))
  })
})
