const {
  esTexts,
  esText,
  esPassageById,
  esUpdateDoc,
  esFindPassages,
  esIndexCounts,
  esPassageInText
} = require("../../es")

// TODO: - revise
const textTypeDefs = `
type Text {
  id: ID!
  title: String
  sentences: [String]
}

type Section {
  sentences: [String]!
  source: String!
  title: String!
  sections_count: Int
  section: Int!
  join_field: JoinField
}

type JoinField {
  name: String!
  parent: String!
}

type Highlight {
  sentences: [String]!
}

type Hit {
  _index: String
  _type: String
  _id: String
  _score: Float
  _source: Section
  highlight: Highlight
}

type TextResult {
  text: Hit
  esPassage: Hit
}

extend type Query {
  texts(index: String!, search: String): [Text]
  text(id: ID!): TextResult
  findEsPassages(lcds: String!): [Hit]
  getEsPassage(id: ID!): Hit
  getEsPassageBySection(index: String!, id: ID!, section: String): Hit
  findIndexCounts(indexes: String!): [Int]
}

extend type Mutation {
  updateText(id: ID!, update: String!): Boolean
}
`

const textResolvers = {
  Query: {
    async texts(_, params) {
      return esTexts(params.index, params.search)
    },

    async text(_, params) {
      return esText("simple_english_wikipedia", params.id)
    },

    getEsPassage(_, params) {
      return esPassageById("simple_english_wikipedia", params.id)
    },

    getEsPassageBySection(_, params) {
      return esPassageInText(
        "simple_english_wikipedia",
        params.id,
        params.section
      )
    },

    async findEsPassages(_, params) {
      return esFindPassages("simple_english_wikipedia", params.lcds)
    },

    async findIndexCounts(_, params) {
      const result = await esIndexCounts(params.indexes.split(",")[0])
      return [result.count]
    }
  },

  Mutation: {
    async updateText(_, params) {
      const body = JSON.parse(decodeURIComponent(update))
      return esUpdateDoc("my_index", params.id, params.body)
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
