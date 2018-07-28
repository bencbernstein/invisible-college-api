const axios = require("axios")
const _ = require("underscore")

const CONFIG = require("../../lib/config")

const WordModel = require("../../models/word")

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
  definition: [Definition]!
  obscurity: Int
  images: [String]
  tags: [Tag]
  unverified: Unverified
}

type Enriched {
  value: String!
  definition: String
  synonyms: [String]
  tags: [String]
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
}

extend type Query {
  words(first: Int, after: String): [Word]
}
`

// OXFORD DICTIONARY API METHODS

const getSenses = apiResult =>
  apiResult.data.results[0].lexicalEntries[0].entries[0].senses

const parseDefinition = res => {
  const obj = getSenses(res)[0]
  const definition = obj.short_definitions[0]
  const tags = (obj.domains || []).map(str => str.toLowerCase())
  const thesaurusLink =
    obj.thesaurusLinks.length && obj.thesaurusLinks[0].sense_id
  return { definition, tags, thesaurusLink }
}

const enrich = async value => {
  try {
    const definitionEndpoint = CONFIG.OXFORD_DICT_URL + "entries/en/" + value
    const thesaurusEndpoint = definitionEndpoint + "/synonyms"

    const app_id = CONFIG.OXFORD_DICTIONARIES_API_ID
    const app_key = CONFIG.OXFORD_DICTIONARIES_API_KEY
    const headers = { app_id, app_key }

    const [res1, res2] = await axios.all([
      axios.get(definitionEndpoint, { headers }),
      axios.get(thesaurusEndpoint, { headers })
    ])

    const { definition, tags, thesaurusLink } = parseDefinition(res1)

    const link = _.find(getSenses(res2), s => s.id === thesaurusLink)
    const synonyms = (link && link.synonyms.map(s => s.text)) || []

    return { definition, synonyms, tags }
  } catch (error) {
    console.error("ERR: " + error.message)
    return { synonyms: [], tags: [] }
  }
}

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
