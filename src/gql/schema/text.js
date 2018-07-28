const _u = require("underscore")
const pos = require("pos")

const TextModel = require("../../models/text")

const textTypeDefs = `
type Tagged {
  id: ID!
  value: String!
  tag: String!
  isFocusWord: Boolean!
  isPunctuation: Boolean!
}

type Passage {
  id: ID!
  startIdx: Int!
  endIdx: Int!
  value: String!
  found: [String]
  tagged: [Tagged]!
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

  updatePassage (
    update: String!
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
        const value = sliced.map(s => s.sentence).join(" ")
        const words = new pos.Lexer().lex(value)
        const tagger = new pos.Tagger()
        const tagged = tagger.tag(words).map(t => ({ value: t[0], tag: t[1] }))
        const found = _u.uniq(_u.flatten(sliced.map(s => s.found)))
        return { startIdx, endIdx, value, found }
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
    },
    async updatePassage(_, params) {
      const decoded = JSON.parse(decodeURIComponent(params.update))
      return TextModel.findOneAndUpdate(
        { "passages._id": decoded.id },
        {
          $set: {
            "passages.$.value": decoded.value,
            "passages.$.tagged": decoded.tagged
          }
        },
        { new: true }
      )
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
