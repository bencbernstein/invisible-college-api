const _ = require("underscore")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const { assertCorrectProperties } = require("./helpers")

const generate = require("../questionGenerators/word")

const word = require("../../gql/tests/mocks/word").mock

// (~) = reverse

describe("words", () => {
  before(async () => await seedDb())

  it("makes a word to definition question", async () => {
    const questions = await generate(word._id, "WORD_TO_DEF", false)
    assertCorrectProperties(questions)
  })

  it("makes a word to definition (~) question", async () => {
    const questions = await generate(word._id, "WORD_TO_DEF", true)
    assertCorrectProperties(questions)
  })

  it("makes a word to synonym question", async () => {
    const questions = await generate(word._id, "WORD_TO_SYN")
    assertCorrectProperties(questions)
  })

  it("makes a word to tag question", async () => {
    const questions = await generate(word._id, "WORD_TO_TAG")
    assertCorrectProperties(questions)
  })

  it("makes a word to image question", async () => {
    const questions = await generate(word._id, "WORD_TO_IMG", false)
    assertCorrectProperties(questions)
  })

  it("makes a word to image (~) question", async () => {
    const questions = await generate(word._id, "WORD_TO_IMG", true)
    assertCorrectProperties(questions)
  })

  it("makes all word questions", async () => {
    const questions = await generate(word._id)
    assertCorrectProperties(questions)
  })
})
