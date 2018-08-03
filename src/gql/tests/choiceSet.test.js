const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const ChoiceSet = require("../../models/choiceSet")

const choiceSet = require("./mocks/choiceSet").mock
const choiceSetMocks = require("./mocks/choiceSet").mocks
const newChoice = "tofuavore"

describe("choice sets", () => {
  beforeEach(async () => await seedDb())

  it("returns choice sets", async function() {
    const query = `
      query {
        choiceSets {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { choiceSets } = result.data

    chai.assert.equal(choiceSets.length, choiceSetMocks.length)
  })

  it("adds a choice to a choice set", async function() {
    const query = `
      mutation {
        addChoice (id: "${choiceSet._id}", value: "${newChoice}") {
          id
          choices
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.addChoice

    chai.assert.equal(updated.id, choiceSet._id.toString())
    chai.assert(expect(updated.choices).to.contain(newChoice))
  })

  it("removes a choice from a choice set", async function() {
    const query = `
      mutation {
        removeChoice (id: "${choiceSet._id}", value: "${newChoice}") {
          id
          choices
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.removeChoice

    chai.assert.equal(updated.id, choiceSet._id.toString())
    chai.assert(expect(updated.choices).to.not.contain(newChoice))
  })

  it("removes a choice set", async function() {
    const query = `
      mutation {
        removeChoiceSet (id: "${choiceSet._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const removed = result.data.removeChoiceSet

    chai.assert.equal(removed.id, choiceSet._id.toString())
  })
})
