const PassageModel = require("../../models/passage")

const passageTypeDefs = `
type Passage {
  id: ID!
  factoidOnCorrect: Boolean!
  difficulty: Int!
  tagged: [Tagged]!
  source: String
  title: String
  esId: ID!
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
  getPassages: [Passage]
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

    getPassages() {
      return PassageModel.find({ enriched: true })
    }
  },
  Mutation: {
    updatePassage(_, params) {
      return PassageModel.findByIdAndUpdate(
        params.id,
        JSON.parse(decodeURIComponent(params.update))
      )
    },

    removePassage(_, params) {
      return PassageModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { passageTypeDefs, passageResolvers }
