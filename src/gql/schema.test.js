const { graphql } = require("graphql")

const schema = require("./schema")
const { closeDb, setupDb } = require("../test/helpers")
const User = require("../models/user")

const user = new User({
  email: "oliver@playwordcraft.com",
  password: "super-secret-password"
})

const notFoundEmail = "wrong@gmail.com"
const incorrectPassword = "super-wrong-password"
const otherEmail = "oliver@gmail.com"

describe("users", () => {
  beforeAll(async () => await setupDb())
  afterAll(async () => await closeDb())

  it("returns an empty array with no users in the db", async () => {
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

    expect(users.length).toBe(0)
  })

  it("return 1 user with 1 user in the db", async () => {
    await user.save()

    const query = `
      query {
        users {
          id
          email
          password
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { users } = result.data

    expect(users.length).toBe(1)
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

    expect(result.data.updateUser.email).toBe(otherEmail)
  })

  it("does login a user with a correct email / password combination", async () => {
    const query = `
      mutation {
        loginUser(email: "${otherEmail}" password: "${user.password}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    expect(result.data.loginUser.email).toBe(otherEmail)
  })

  it("does NOT login a user with an incorrect email / password combination", async () => {
    const query = `
      mutation {
        loginUser(email: "${otherEmail}" password: "${incorrectPassword}") {
          email
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)

    expect(result.errors[0].message).toBe("Incorrect password.")
    expect(result.data.loginUser).toBe(null)
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

    expect(result.errors[0].message).toBe("Email not found.")
    expect(result.data.loginUser).toBe(null)
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

    expect(result.data.removeUser.id).toBe(`${user._id}`)
  })
})
