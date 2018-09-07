const _ = require("underscore")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const { assertCorrectProperties } = require("./helpers")

const { passageQuestions } = require("../questionGenerators/sentence")

const PASSAGES = _.flatten(
  require("../../gql/tests/mocks/text").mocks.map(m => m.passages)
)
const PASSAGE = PASSAGES.shift()

const CATEGORY = "Zoology"

describe("sentence questions", () => {
  before(async () => await seedDb())

  it("makes sentence to part of speech questions for a text", async () => {
    const questions = await passageQuestions(
      PASSAGE,
      PASSAGES,
      CATEGORY,
      "SENTENCE_TO_POS"
    )
    assertCorrectProperties(questions)
  })

  it("makes sentence to truthfulness questions for a text", async () => {
    const questions = await passageQuestions(
      PASSAGE,
      PASSAGES,
      CATEGORY,
      "SENTENCE_TO_TRUTH"
    )
    assertCorrectProperties(questions)
  })

  // it("makes finish the sentence questions for a text", async () => {
  //   const questions = await passageQuestions(
  //     PASSAGE,
  //     CATEGORY,
  //     "FINISH_THE_SENTENCE"
  //   )
  //   assertCorrectProperties(questions)
  // })

  it("makes passage metadata questions for a text", async () => {
    const questions = await passageQuestions(
      PASSAGE,
      PASSAGES,
      CATEGORY,
      "PASSAGE_METADATA"
    )
    assertCorrectProperties(questions)
  })

  it("makes scramble passage questions for a text", async () => {
    const questions = await passageQuestions(
      PASSAGE,
      PASSAGES,
      CATEGORY,
      "SCRAMBLE_PASSAGE"
    )
    assertCorrectProperties(questions)
  })

  it("makes scramble sentence questions for a text", async () => {
    const questions = await passageQuestions(
      PASSAGE,
      PASSAGES,
      CATEGORY,
      "SCRAMBLE_SENTENCE"
    )
    assertCorrectProperties(questions)
  })

  // it("makes all text questions", async () => {
  //   const questions = await passageQuestions(text._id)
  //   assertCorrectProperties(questions)
  // })
})
