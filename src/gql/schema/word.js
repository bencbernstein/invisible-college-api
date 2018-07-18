var WordModel = require("../../models/word")

const wordTypeDefs = `
type Component {
  value: String!
  isRoot: Boolean!
}

type Definition {
  value: String!
  highlight: Boolean!
}

type Word {
  value: String!
  isDecomposable: Boolean!
  id: ID!
  components: [Component]
  definition: [Definition]!
  obscurity: Int
}

extend type Query {
  word: Word
}

extend type Query {
  words(first: Int!, after: String): [Word]
}
`

const wordResolvers = {
  Query: {
    word() {
      return WordModel.findOne().catch(err => new Error(err))
    },

    words(_, params) {
      const query = params.after ? { value: { $gt: params.after } } : {}
      return WordModel.find(query)
        .limit(params.first)
        .sort("value")
    }
  }
}

module.exports = { wordTypeDefs, wordResolvers }
