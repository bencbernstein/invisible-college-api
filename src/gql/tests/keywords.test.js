const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const schema = require("./../schema")

describe("words", () => {
  beforeEach(async () => await seedDb())

  it("returns keywords", async function() {
    const query = `
      query {
        keywords
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { keywords } = result.data

    chai.assert.isString(keywords)
    chai.assert.isObject(JSON.parse(keywords))
    chai.assert.hasAllKeys(JSON.parse(keywords), ["words", "choices"])
  })
})
