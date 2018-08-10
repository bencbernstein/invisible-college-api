const _ = require("underscore")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const { assertCorrectProperties } = require("./helpers")

const generate = require("../questionGenerators/sentence")

const text = require("../../gql/tests/mocks/text").mock

describe("sentence questions", () => {
  before(async () => await seedDb())

  it("makes sentence to part of speech questions for a text", async () => {
    const questions = await generate(text._id, null, "SENTENCE_TO_POS")
    assertCorrectProperties(questions)
  })

  it.only("makes sentence to truthfulness questions for a text", async () => {
    const questions = await generate(text._id, null, "SENTENCE_TO_TRUTH")
    console.log(questions[0])
    console.log(questions[1])
    assertCorrectProperties(questions)
  })

  it("makes all text questions", async () => {
    const questions = await generate(text._id)
    assertCorrectProperties(questions)
  })
})
