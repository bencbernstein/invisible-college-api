const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect
const mongoose = require("mongoose")

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")

const passageSequence = require("./mocks/passageSequence").mock
const passageSequenceMocks = require("./mocks/passageSequence").mocks

const textMocks = require("./mocks/text").mocks

describe("passage sequences", () => {
  beforeEach(async () => await seedDb())

  it("creates a passage sequence", async function() {
    const name = "New Sequence"

    const query = `
      mutation {
        createPassageSequence (name: "${name}") {
          name
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { createPassageSequence } = result.data

    chai.assert.equal(createPassageSequence.name, name)
  })

  it("returns passage sequences", async function() {
    const query = `
      query {
        passageSequences {
          id
          name
          count
          passages
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { passageSequences } = result.data

    chai.assert.equal(passageSequences.length, passageSequenceMocks.length)
  })

  it("returns a passage sequence by id", async function() {
    const query = `
      query {
        passageSequence(id: "${passageSequence._id}") {
          id
          startIdx
          endIdx
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const passages = result.data.passageSequence

    chai.assert.equal(passages.length, passageSequence.passages.length)
  })

  it("updates a passage sequence by id", async function() {
    const passages = encodeURIComponent(JSON.stringify([]))

    const query = `
      mutation {
        updatePassageSequence(id: "${
          passageSequence._id
        }", passages: "${passages}") {
          id
          passages
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { updatePassageSequence } = result.data

    chai.assert.equal(updatePassageSequence.passages.length, 0)
  })

  it("adds a passage to a passage sequence", async function() {
    const passageId = textMocks[1].passages[0]._id.toString()

    const query = `
      mutation {
        addPassageToPassageSequence (id: "${
          passageSequence._id
        }", passageId: "${passageId}") {
          id
          count
          passages
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.addPassageToPassageSequence

    chai.assert.equal(updated.id, passageSequence._id)
    chai.assert.equal(updated.count, passageSequence.passages.length + 1)
    chai.assert.include(updated.passages, passageId)
  })

  it("remove a passage sequence", async function() {
    const query = `
      mutation {
        removePassageSequence (id: "${passageSequence._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { removePassageSequence } = result.data

    chai.assert.equal(removePassageSequence.id, passageSequence._id)
  })
})
