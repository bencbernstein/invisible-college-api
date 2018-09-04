const _ = require("underscore")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const { assertCorrectProperties } = require("./helpers")

const { generateQuestionsForText } = require("../questionGenerators/sentence")

const text = require("../../gql/tests/mocks/text").mock

describe("sentence questions", () => {
  before(async () => await seedDb())

  it("makes sentence to part of speech questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "SENTENCE_TO_POS"
    )
    assertCorrectProperties(questions)
  })

  it("makes sentence to truthfulness questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "SENTENCE_TO_TRUTH"
    )
    assertCorrectProperties(questions)
  })

  it("makes finish the sentence questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "FINISH_THE_SENTENCE"
    )
    assertCorrectProperties(questions)
  })

  it("makes passage metadata questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "PASSAGE_METADATA"
    )
    assertCorrectProperties(questions)
  })

  it("makes scramble passage questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "SCRAMBLE_PASSAGE"
    )
    assertCorrectProperties(questions)
  })

  it("makes scramble sentence questions for a text", async () => {
    const questions = await generateQuestionsForText(
      text._id,
      null,
      "SCRAMBLE_SENTENCE"
    )
    assertCorrectProperties(questions)
  })

  it("makes all text questions", async () => {
    const questions = await generateQuestionsForText(text._id)
    assertCorrectProperties(questions)
  })
})
