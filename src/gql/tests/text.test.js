const _u = require("underscore")
const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const Text = require("../../models/text")

let text = require("./mocks/text").mock
let mocks = require("./mocks/text").mocks

describe("texts", () => {
  beforeEach(async () => await seedDb())

  it("return texts with from the db", async () => {
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

    chai.assert.equal(texts.length, mocks.length)
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
    const ranges = [[0, 3], [5, 6]]

    const query = `
      mutation {
        addPassages (id: "${text._id}", ranges: ${JSON.stringify(
      ranges
    )}) {        
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

  it("parses source for passages in a text with multiple", async () => {
    const ranges = [[5, 7]]

    const multipleSourcesMock = _u.last(mocks)

    const query = `
      mutation {
        addPassages (id: "${multipleSourcesMock._id}", ranges: ${JSON.stringify(
      ranges
    )}) {
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
      multipleSourcesMock.passages.length + ranges.length
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

    const encoded = encodeURIComponent(JSON.stringify(newPassage))

    const query = `
      mutation {
        updatePassage (update: "${encoded}") {
          id
          passagesCount
          unenrichedPassagesCount
          passages {
            value
            tagged {
              value
              tag
              isFocusWord
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
    chai.assert.equal(updated.passagesCount, updated.passages.length)
  })
})
