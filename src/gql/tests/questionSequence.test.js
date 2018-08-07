const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect
const mongoose = require("mongoose")

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const ChoiceSet = require("../../models/questionSequence")

const questionSequence = require("./mocks/questionSequence").mock
const questionSequenceMocks = require("./mocks/questionSequence").mocks

describe("question sequences", () => {
  beforeEach(async () => await seedDb())

  it("creates a question sequence", async function() {
    const query = `
      mutation {
        createQuestionSequence (name: "test", question: "${mongoose.Types.ObjectId()}") {
          id
          name
          questions
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const newQuestionSequence = result.data.createQuestionSequence

    chai.assert.equal(newQuestionSequence.questions.length, 1)
  })

  it("returns question sequences", async function() {
    const query = `
      query {
        questionSequences {
          id
          name
          questions
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { questionSequences } = result.data

    chai.assert.equal(questionSequences.length, questionSequenceMocks.length)
  })

  it("returns a question sequence with full questions", async function() {
    const query = `
      query {
        questionSequence(id: "${questionSequence._id}") {
          id
          name
          questions
          fullQuestions {
            id
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
              text {
                id
                value
              }
              word {
                id
                value
              }
            }
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const found = result.data.questionSequence

    chai.assert.equal(found.questions.length, found.fullQuestions.length)
  })

  it("updates a question sequence", async function() {
    const questions = questionSequence.questions.slice(0, 2)
    const query = `
      mutation {
         updateQuestionSequence (id: "${
           questionSequence._id
         }", questions: "${encodeURIComponent(JSON.stringify(questions))}") {
          id
          questions
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.updateQuestionSequence

    chai.assert.equal(updated.id, questionSequence._id.toString())
    chai.assert.notEqual(questionSequence.questions.length, questions.length)
    chai.assert.equal(updated.questions.length, questions.length)
  })
})
