const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect
const mongoose = require("mongoose")

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const User = require("../../models/user")

const user = require("./mocks/user").mock
const mocks = require("./mocks/user").mocks
const text = require("./mocks/text").mock

const notFoundEmail = "wrong@gmail.com"
const incorrectPassword = "super-wrong-password"
const otherEmail = "oliver@gmail.com"

describe("users", () => {
  beforeEach(async () => await seedDb())

  it("returns users", async () => {
    const query = `
      query {
        users {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { users } = result.data

    chai.assert.equal(users.length, mocks.length)
  })

  it("updates a user", async () => {
    const query = `
      mutation {
        updateUser(id: "${user._id}" email: "${otherEmail}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    chai.assert.equal(result.data.updateUser.email, otherEmail)
  })

  it("does login a user with a correct email / password combination", async () => {
    const query = `
      mutation {
        loginUser(email: "${user.email}" password: "${user.password}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    chai.assert.equal(result.data.loginUser.email, user.email)
  })

  it("does NOT login a user with an incorrect email / password combination", async () => {
    const query = `
      mutation {
        loginUser(email: "${user.email}" password: "${incorrectPassword}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    chai.assert.equal(result.errors[0].message, "Incorrect password.")
    chai.assert.equal(result.data.loginUser, null)
  })

  it("does NOT login a user with a not existing email", async () => {
    const query = `
      mutation {
        loginUser(email: "${notFoundEmail}" password: "${incorrectPassword}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    chai.assert.equal(result.errors[0].message, "Email not found.")
    chai.assert.equal(result.data.loginUser, null)
  })

  it("removes a user", async () => {
    const query = `
      mutation {
        removeUser(id: "${user._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    chai.assert.equal(result.data.removeUser.id, `${user._id}`)
  })

  it("adds a new bookmark for a user", async () => {
    const query = `
      mutation {
        saveBookmark(userId: "${user._id}", textId: "${
      text._id
    }", sentenceIdx: ${400}) {
          id
          bookmarks {
            textId
            sentenceIdx
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.saveBookmark

    chai.assert.equal(updated.bookmarks.length, 2)
  })

  it("updates a bookmark for a user", async () => {
    const query = `
      mutation {
        saveBookmark(userId: "${user._id}", textId: "${
      user.bookmarks[0].textId
    }", sentenceIdx: ${400}) {
          id
          bookmarks {
            textId
            sentenceIdx
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.saveBookmark

    chai.assert.equal(updated.bookmarks.length, 1)
  })

  it("saves questions for a user", async () => {
    const questions = [
      {
        type: "Word",
        value: "carnivore",
        id: mongoose.Types.ObjectId(),
        correct: true
      },
      {
        type: "Word",
        value: "herbivore",
        id: user.words[0].id,
        correct: true
      },
      {
        type: "Passage",
        value: "About Zoology",
        id: mongoose.Types.ObjectId(),
        correct: false
      }
    ]

    const encoded = encodeURIComponent(JSON.stringify(questions))

    const query = `
      mutation {
        saveQuestionsForUser(id: "${user._id}", questions: "${encoded}") {
          id
          words {
            id
            correctCount
            seenCount
            experience
          }
          passages {
            id
            correctCount
            seenCount
            experience
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { words, passages } = result.data.saveQuestionsForUser

    chai.assert.isNotEmpty(words)
    chai.assert.isNotEmpty(passages)
  })

  it.only("gets stats for for a user", async () => {
    const query = `
      mutation {
        getStats(id: "${user._id}") {
          user {
            id
            wordsLearned
            passagesRead
            questionsAnswered  
          }
          ranks {
            id
            no
            questionsAnswered
            initials
          }
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { getStats } = result.data

    chai.assert.equal(getStats.user.wordsLearned, user.words.length)
    chai.assert.equal(getStats.user.passagesRead, user.passages.length)
    chai.assert.isArray(getStats.ranks)
    chai.assert.isNotEmpty(getStats.ranks)
  })
})
