const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const Text = require("../../models/text")

let text = require("./mocks/text").mock

describe("texts", () => {
  beforeEach(async () => await seedDb())

  it("return 1 text with 1 text in the db", async () => {
    const query = `
      query {
        texts {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { texts } = result.data

    chai.assert.equal(texts.length, 1)
  })

  it("finds a text by its id", async () => {
    const query = `
      query {
        text (id: "${text._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const found = result.data.text

    chai.assert.equal(found.id, text._id.toString())
  })

  it("saves passages for a text", async () => {
    const ranges = [[0, 1], [10, 14]]

    const query = `
      mutation {
        addPassages (id: "${text._id}", ranges: ${JSON.stringify(ranges)}) {
          id
          name
          passages {
            id
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.addPassages

    chai.assert.equal(
      updated.passages.length,
      text.passages.length + ranges.length
    )
  })

  it("removes passages for a text", async () => {
    const query = `
      mutation {
        removePassage (textId: "${text._id}", passageId: "${
      text.passages[0]._id
    }") {
          id
          passages {
            id
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.removePassage

    chai.assert.equal(updated.passages.length, text.passages.length - 1)
  })

  it("updates a passages for a text", async () => {
    const newPassage = {
      id: text.passages[0]._id,
      value: "something different",
      tagged: [
        {
          value: "The",
          tag: "NN",
          isFocusWord: true
        }
      ]
    }
    text.passages[0].value = text.passages[0].tagged[0].value = "The"
    text.passages[0].tagged[0].tag = "NN"
    text.passages[0].tagged[0].isFocusWord = true

    const encoded = encodeURIComponent(JSON.stringify(newPassage))

    const query = `
      mutation {
        updatePassage (update: "${encoded}") {
          id
          passages {
            value
            tagged {
              tag
              isFocusWord
              value
            }
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.updatePassage

    chai.assert.equal(updated.passages[0].value, newPassage.value)
    chai.assert.equal(
      updated.passages[0].tagged[0].value,
      newPassage.tagged[0].value
    )
    chai.assert.equal(
      updated.passages[0].tagged[0].tag,
      newPassage.tagged[0].tag
    )
    chai.assert.equal(
      updated.passages[0].tagged[0].isFocusWord,
      newPassage.tagged[0].isFocusWord
    )
  })
})