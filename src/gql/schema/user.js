const _u = require("underscore")
const UserModel = require("../../models/user")

const userTypeDefs = `
type Bookmark {
  textId: String!
  sentenceIdx: Int!
}

type User {
  firstName: String
  lastName: String
  id: ID!
  email: String!
  password: String!
  bookmarks: [Bookmark]!
}

type Query {
  users: [User]

  user(id: ID!): User
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

  saveBookmark (
    userId: String!
    textId: String!
    sentenceIdx: Int!
  ): User
}

schema {
  query: Query
  mutation: Mutation
}
`

const userResolvers = {
  Query: {
    user(_, params) {
      return UserModel.findById(params.id).catch(err => new Error(err))
    },

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
    },
    async saveBookmark(_, params) {
      const user = await UserModel.findById(params.userId)
      const bookmarks = user.bookmarks
      const bookmark = {
        textId: params.textId,
        sentenceIdx: parseInt(params.sentenceIdx, 10)
      }
      const idx = _u.findIndex(
        bookmarks,
        b => b.textId.toString() === bookmark.textId
      )
      if (idx > -1) {
        bookmarks[idx] = bookmark
      } else {
        bookmarks.push(bookmark)
      }
      user.save()
      return user
    }
  }
}

module.exports = { userTypeDefs, userResolvers }
