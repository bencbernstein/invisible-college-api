var TextModel = require("../../models/text")

const textTypeDefs = `
type Text {
  id: ID!
  name: String!
  source: String!
  tokenized: String!
}

extend type Query {
  text(id: ID!): Text
}

extend type Query {
  texts: [Text]
}
`

const textResolvers = {
  Query: {
    texts() {
      return TextModel.find({}, { name: 1, source: 1 }).catch(
        err => new Error(err)
      )
    },

    text(_, params) {
      return TextModel.findById(params.id).catch(err => new Error(err))
    }
  },
  Mutation: {}
}

module.exports = { textTypeDefs, textResolvers }
