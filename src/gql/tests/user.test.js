const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const schema = require("./../schema")
const { seedDb } = require("../../test/helpers")
const User = require("../../models/user")

const user = require("./mocks/user").mock
const text = require("./mocks/text").mock

const notFoundEmail = "wrong@gmail.com"
const incorrectPassword = "super-wrong-password"
const otherEmail = "oliver@gmail.com"

describe("users", () => {
  beforeEach(async () => await seedDb())

  it("return 1 user with 1 user in the db", async () => {
    const query = `
      query {
        users {
          id
          email
          password
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
    const { users } = result.data

    chai.assert.equal(users.length, 1)
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
})
