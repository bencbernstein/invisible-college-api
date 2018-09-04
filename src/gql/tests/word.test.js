const _ = require("underscore")
const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const schema = require("./../schema")
const Word = require("../../models/word")

const word = require("./mocks/word").mock
const wordMocks = require("./mocks/word").mocks

const newWord = "factory"
const definition =
  "building or group of buildings where goods are manufactured or assembled chiefly by machine"

describe("words", () => {
  beforeEach(async () => await seedDb())

  it("return 1 word with 1 word in the db", async function() {
    const query = `
      query {
        words {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { words } = result.data

    chai.assert.equal(words.length, wordMocks.length)
  })

  it("finds a word by its id", async function() {
    const query = `
      query {
        word (id: "${word._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const found = result.data.word

    chai.assert.equal(found.id, word._id.toString())
  })

  it("enriches a value", async function() {
    const query = `
      mutation {
        enrichWord (value: "${newWord}") {
          value
          definition
          synonyms
          tags
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const enriched = result.data.enrichWord

    chai.assert.equal(enriched.value, newWord)
    chai.assert.equal(enriched.definition, definition)
  })

  it("automatically enriches a new word", async function() {
    const query = `
      mutation {
        addWord (value: "${newWord}") {
          id
          unverified {
            definition
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const enriched = result.data.addWord

    chai.assert.equal(enriched.unverified.definition, definition)
  })

  it("updates a word", async function() {
    const encoded = encodeURIComponent(
      JSON.stringify(_.extend({}, word, { obscurity: 2, id: word._id }))
    )

    const query = `
      mutation {
        updateWord (word: "${encoded}") {
          id
          obscurity
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.updateWord

    chai.assert.equal(updated.obscurity, 2)
    chai.assert.equal(updated.id, word._id.toString())
  })

  it("remove a word", async function() {
    const query = `
      mutation {
        removeWord (id: "${word._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const removed = result.data.removeWord

    chai.assert.equal(removed.id, word._id.toString())
  })

  it("gets all the keywords", async function() {
    const query = `
      query {
        keywords
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { words, choices } = JSON.parse(result.data.keywords)

    chai.assert.isNotEmpty(words)
    chai.assert.isNotEmpty(choices)
  })
})
