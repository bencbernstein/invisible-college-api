const _ = require("underscore")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const { assertCorrectProperties } = require("./helpers")

const generate = require("../questionGenerators/word")

const WordModel = require("../../models/word")

// (~) = reverse

const CATEGORY = "TEST"

let RED_HERRINGS, WORD

describe("words", () => {
  before(async () => {
    await seedDb()
    RED_HERRINGS = await WordModel.find()
    WORD = _.find(RED_HERRINGS, r => r.value === "cardiogram")
    RED_HERRINGS = RED_HERRINGS.filter(r => r.value !== "cardiogram")
  })

  it("makes a word to definition question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_DEF"
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to definition (~) question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_DEF",
      true
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to synonym question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_SYN"
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to tag question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_TAG"
    )
    assertCorrectProperties(questions)
  })

  it("makes word to characters questions", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_CHARS"
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to root question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_ROOTS"
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to image question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_IMG"
    )
    assertCorrectProperties(questions)
  })

  it("makes a word to image (~) question", async () => {
    const questions = await generate(
      WORD,
      RED_HERRINGS,
      CATEGORY,
      "WORD_TO_IMG",
      true
    )
    assertCorrectProperties(questions)
  })

  /*it("makes all word questions", async () => {
    const questions = await generate(word._id)
    assertCorrectProperties(questions)
  })*/
})
