var UserModel = require("../../models/user")

const userTypeDefs = `
type User {
  firstName: String
  lastName: String
  id: ID!
  email: String!
  password: String!
}

type Query {
  users: [User]
}

type Mutation {
  addUser (
    firstName: String
    lastName: String
    email: String!
    password: String!
  ): User

  updateUser (
    id: String!
    email: String!
  ): User

  loginUser (
    email: String!
    password: String!
  ): User

  removeUser (
    id: ID!
  ): User
}

schema {
  query: Query
  mutation: Mutation
}
`

const userResolvers = {
  Query: {
    users() {
      return UserModel.find().catch(err => new Error(err))
    }
  },
  Mutation: {
    addUser(_, params) {
      return UserModel.create(params)
    },
    async loginUser(_, params) {
      const users = await UserModel.find({ email: params.email })
      const user = users[0]
      if (user) {
        if (user.password === params.password) {
          return user
        } else {
          throw new Error("Incorrect password.")
        }
      }
      throw new Error("Email not found.")
    },
    removeUser(_, params) {
      const removed = UserModel.findByIdAndRemove(params.id).exec()
      if (!removed) {
        throw new Error("Error")
      }
      return removed
    },
    updateUser(_, params) {
      return UserModel.findByIdAndUpdate(
        params.id,
        { $set: { email: params.email } },
        { new: true }
      )
    }
  }
}

module.exports = { userTypeDefs, userResolvers }
