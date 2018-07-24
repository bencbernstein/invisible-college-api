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
    const ranges = [[1, 3], [10, 14]]

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
})
