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
  value: String
  found: [String]
  tagged: [Tagged]!
  isEnriched: Boolean!
}

type Text {
  id: ID!
  name: String!
  source: String!
  tokenized: String!
  passages: [Passage]
  isPreFiltered: Boolean
  passagesCount: Int
  unenrichedPassagesCount: Int
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

  removeText (
    id: ID!
  ): Text

  updatePassage (
    update: String!
  ): Text    
}
`

const textResolvers = {
  Query: {
    texts() {
      return TextModel.find(
        {},
        { name: 1, source: 1, passagesCount: 1, unenrichedPassagesCount: 1 }
      ).catch(err => new Error(err))
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
      try {
        const decoded = JSON.parse(decodeURIComponent(params.update))
        const text = await TextModel.findOne({ "passages._id": decoded.id })
        const passages = text.passages
        const idx = _u.findIndex(passages, p => p._id.equals(decoded.id))
        passages[idx].value = decoded.value
        passages[idx].tagged = decoded.tagged
        passages[idx].isEnriched = true
        text.passagesCount = passages.length
        text.unenrichedPassagesCount = passages.filter(
          p => !p.isEnriched
        ).length
        text.save()
        return text
      } catch (e) {
        console.log(e)
      }
    },
    async removeText(_, params) {
      return TextModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
