const mongoose = require("mongoose")
const { range } = require("underscore")

const UserModel = require("../../models/user")
const cache = require("../../cache")

const userTypeDefs = `
type Bookmark {
  textId: String!
  sentenceIdx: Int!
}

type WordExperience {
  id: String!
  value: String!
  seenCount: Int!
  correctCount: Int!
  experience: Int!
}

type PassageExperience {
  id: String!
  value: String!
  seenCount: Int!
  correctCount: Int!
  experience: Int!
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
  getStats(id: ID!): StatsResult
}

type Rank {
  no: Int!
  id: ID!
  questionsAnswered: Int!
  initials: String!
}

type StatsResult {
  user: User
  ranks: [Rank]
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
    },

    async getStats(_, params) {
      const id = params.id
      const user = await UserModel.findById(id)
      if (!user) throw new Error("User not found.")

      const { words, passages } = user
      user.wordsLearned = words.length
      user.passagesRead = passages.length
      user.questionsAnswered = words
        .concat(passages)
        .map(({ seenCount }) => seenCount)
        .reduce((a, b) => a + b, 0)

      await user.save()

      const LEADERBOARD = "all_time_leaderboard"
      await cache.zadd([LEADERBOARD, user.questionsAnswered, id])

      let lower, upper

      return cache
        .zrevrankAsync([LEADERBOARD, id])
        .then(rank => {
          lower = Math.max(0, rank - 2)
          upper = rank + 2
          return [lower, upper]
        })
        .then(params => cache.zrevrangeAsync([LEADERBOARD, ...params]))
        .then(async ranks => {
          ranks = range(lower, upper + 1)
            .map((no, idx) => ({ no: no + 1, id: ranks[idx] }))
            .filter(({ id }) => id)

          const _id = { $in: ranks.map(r => r.id).map(mongoose.Types.ObjectId) }
          const users = await UserModel.find({ _id })

          ranks.forEach(rank => {
            const user = users.find(user => user._id.equals(rank.id))
            rank.initials = user.initials()
            rank.questionsAnswered = user.questionsAnswered
          })

          return { user, ranks }
        })
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
      if (user) throw new Error("Email taken.")
      return UserModel.create(params)
    },

    removeUser(_, params) {
      return UserModel.findByIdAndRemove(params.id)
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
