const mongoose = require("mongoose")
const PassageModel = require("../../models/passage")
const QuestionModel = require("../../models/question")

const {
  createPassageQuestions
} = require("../../services/questionGenerators/sentence/index")

const passageTypeDefs = `
type Passage {
  id: ID!
  factoidOnCorrect: Boolean!
  difficulty: Int!
  tagged: [Tagged]!
  source: String
  title: String
  esId: ID!
  curriculumId: ID!
}

type Tagged {
  id: ID
  value: String
  pos: String
  isFocusWord: Boolean
  isPunctuation: Boolean
  isSentenceConnector: Boolean
  isConnector: Boolean
  isUnfocused: Boolean
  wordId: String
  choiceSetId: String
}

extend type Query {
  getPassage(id: ID!): Passage
  getPassages(curriculumId: ID): [Passage]
}

extend type Mutation {
  updatePassage(id: ID!, update: String!): Passage
  removePassage(id: ID!): Passage
}
`

const passageResolvers = {
  Query: {
    getPassage(_, params) {
      return PassageModel.findById(params.id)
    },

    getPassages(_, params) {
      const query = { enriched: true }
      if (params.curriculumId) {
        query.curriculumId = params.curriculumId
      }
      return PassageModel.find(query)
    }
  },
  Mutation: {
    updatePassage(_, params) {
      createPassageQuestions(params.id)
      return PassageModel.findByIdAndUpdate(
        params.id,
        JSON.parse(decodeURIComponent(params.update))
      )
    },

    async removePassage(_, params) {
      await QuestionModel.remove({
        "sources.passage.id": mongoose.Types.ObjectId(params.id)
      })
      return PassageModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { passageTypeDefs, passageResolvers }
