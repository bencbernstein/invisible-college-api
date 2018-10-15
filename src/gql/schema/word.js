const _u = require("underscore")
const WordModel = require("../../models/word")
const PassageModel = require("../../models/passage")

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
  unfilteredPassagesCount: Int
  rejectedPassagesCount: Int
  acceptedPassagesCount: Int
  enrichedPassagesCount: Int
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
  words(first: Int, startingWith: String, sortBy: String): [Word]
  wordsToEnrich(attr: String): [Word]
  passagesForWord(value: String): [Passage]
  recommendPassageQueues(type: String!, limit: Int): [String]
}
`

const wordResolvers = {
  Query: {
    word(_, params) {
      return WordModel.findById(params.id).catch(err => new Error(err))
    },

    words(_, params) {
      const { first, sortBy, startingWith } = params
      const ascending = sortBy === "value" // Add asc. / desc. option later?
      var value = new RegExp("^" + startingWith)
      const query = { value }
      const sort = {}
      sort[sortBy] = ascending ? 1 : -1
      return WordModel.find(query).sort(sort)
    },

    async wordsByValues(_, params) {
      return WordModel.find({ value: params.values.split(",") })
    },

    async passagesForWord(_, params) {
      const word = await WordModel.findOne({ value: params.value })
      return PassageModel.find({ _id: word.passages })
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
      words = words.slice(0, 25)
      return words
    },

    async recommendPassageQueues(_, params) {
      const query = {}
      query[`${params.type}PassagesCount`] = { $gt: 0 }
      const words = await WordModel.find(query, { value: 1 }).limit(
        params.limit || 3
      )
      return words.map(w => w.value)
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
    removeWord(_, params) {
      return WordModel.findByIdAndRemove(params.id)
    },
    updateWord(_, params) {
      const decoded = JSON.parse(decodeURIComponent(params.word))
      return WordModel.findByIdAndUpdate(decoded.id, decoded, { new: true })
    }
  }
}

module.exports = { wordTypeDefs, wordResolvers }
