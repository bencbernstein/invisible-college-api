const _u = require("underscore")
const UserModel = require("../../models/user")

const userTypeDefs = `
type Bookmark {
  textId: String!
  sentenceIdx: Int!
}

type WordExperience {
  id: String!
  questions: [String]!
  value: String!
  seenCount: Int!
  correctCount: Int!
  timeSpent: Float!
  experience: Int!
}

type PassageExperience {
  id: String!
  questions: [String]!
  source: String!
  seenCount: Int!
  correctCount: Int!
  collected: Boolean
}

type User {
  firstName: String
  lastName: String
  id: ID!
  email: String!
  password: String!
  bookmarks: [Bookmark]!
  level: Int!
  questionsAnswered: Int!
  wordsLearned: Int!
  passagesRead: Int!
  rank: Int
  words: [WordExperience]!
  passages: [PassageExperience]!
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

  createUser (
    email: String!
    password: String!
    firstName: String!
    lastName: String!
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
      const { email, password } = params
      const user = await UserModel.findOne({ email })

      if (user) {
        const result = await user.comparePassword(password)
        if (result === true) {
          return user
        }
        throw new Error(
          result === false ? "Incorrect password." : result.message
        )
      }

      throw new Error("Email not found.")
    },
    async createUser(_, params) {
      const user = await UserModel.findOne({ email: params.email })
      if (user) {
        throw new Error("Email taken.")
      }
      return UserModel.create(params)
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
