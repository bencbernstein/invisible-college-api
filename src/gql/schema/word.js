const _u = require("underscore")
const WordModel = require("../../models/word")

const { enrich } = require("../../services/OxfordDictionaryService")

const wordTypeDefs = `
type Component {
  value: String!
  isRoot: Boolean!
}

type Definition {
  value: String!
  highlight: Boolean!
}

type Unverified {
  definition: String
  tags: [String]
  synonyms: [String]
}

type Tag {
  id: ID
  value: String!
  choiceSetIds: [String]
}

type Word {
  value: String!
  isDecomposable: Boolean!
  id: ID!
  components: [Component]
  synonyms: [String]
  definition: [Definition]!
  obscurity: Int
  images: [String]
  lcd: String
  otherForms: [String]
  tags: [Tag]
  unverified: Unverified
}

type Enriched {
  value: String!
  definition: String
  synonyms: [String]
  tags: [String]
  lemmas: [String]
}

extend type Mutation {
  addWord (
    value: String!
  ): Word

  enrichWord (
    value: String!
  ): Enriched

  removeWord (
    id: ID!
  ): Word

  updateWord (
    word: String!
  ): Word
}

extend type Query {
  word(id: ID!): Word 
  wordsByValues(values: String): [Word]
  words(first: Int, after: String): [Word]
  wordsToEnrich(attr: String): [Word]
}
`

const wordResolvers = {
  Query: {
    word(_, params) {
      return WordModel.findById(params.id).catch(err => new Error(err))
    },

    words(_, params) {
      const query = params.after ? { value: { $gt: params.after } } : {}
      return WordModel.find(query)
        .limit(params.first || 20)
        .sort("value")
    },

    async wordsByValues(_, params) {
      return WordModel.find({ value: params.values.split(",") })
    },

    async wordsToEnrich(_, params) {
      const { attr } = params
      const query = {}

      if (attr == "obscurity") {
        query[attr] = { $exists: false }
      } else if (attr !== "all") {
        query[attr] = { $size: 0 }
      }

      let words = await WordModel.find(query)
      word = _u.shuffle(words)

      if (attr === "all") {
        words = words.slice(0, 50)
      }

      return words
    }
  },
  Mutation: {
    async addWord(_, params) {
      const value = params.value.toLowerCase()
      const unverified = await enrich(value)
      return WordModel.create({ value, unverified })
    },
    async enrichWord(_, params) {
      const value = params.value.toLowerCase()
      const unverified = await enrich(value)
      return { value, ...unverified }
    },
    async removeWord(_, params) {
      return WordModel.findByIdAndRemove(params.id)
    },
    async updateWord(_, params) {
      const decoded = JSON.parse(decodeURIComponent(params.word))
      return WordModel.findByIdAndUpdate(decoded.id, decoded, { new: true })
    }
  }
}

module.exports = { wordTypeDefs, wordResolvers }
