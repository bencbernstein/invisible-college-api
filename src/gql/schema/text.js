const _u = require("underscore")

const TextModel = require("../../models/text")

const textTypeDefs = `
type Passage {
  id: ID!
  startIdx: Int!
  endIdx: Int!
  passage: String!
  found: [String]
}

type Text {
  id: ID!
  name: String!
  source: String!
  tokenized: String!
  passages: [Passage]
}

extend type Query {
  text(id: ID!): Text
}

extend type Query {
  texts: [Text]
}

extend type Mutation {
  addPassages (
    id: ID!
    ranges: [[Int]]
  ): Text

  removePassage (
    textId: ID!
    passageId: ID!
  ): Text  
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
  Mutation: {
    async addPassages(_, params) {
      const text = await TextModel.findById(params.id)

      let passages = text.passages
      const tokenized = JSON.parse(text.tokenized)

      const update = params.ranges.map(range => {
        const [startIdx, endIdx] = range
        const sliced = tokenized.slice(startIdx, endIdx)
        const passage = sliced.map(s => s.sentence).join(" ")
        const found = _u.uniq(_u.flatten(sliced.map(s => s.found)))
        return { startIdx, endIdx, passage, found }
      })

      passages = passages.concat(update)

      return TextModel.findByIdAndUpdate(
        params.id,
        { $set: { passages } },
        { new: true }
      )
    },
    async removePassage(_, params) {
      return TextModel.findByIdAndUpdate(
        params.textId,
        { $pull: { passages: { _id: params.passageId } } },
        { new: true }
      )
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
