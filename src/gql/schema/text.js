const _u = require("underscore")
const pos = require("pos")

const TextModel = require("../../models/text")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")

const CONNECTORS = _u.flatten(
  require("../../lib/connectors").map(c => c.elements)
)

const textTypeDefs = `
type Tagged {
  id: ID!
  value: String
  tag: String
  isFocusWord: Boolean
  isPunctuation: Boolean
  isSentenceConnector: Boolean
  isConnector: Boolean
  isUnfocused: Boolean
  wordId: String
  choiceSetId: String
  entity: String
}

type Metadata {
  name: String
  source: String
  date: String
  author: String
}

type Passage {
  id: ID!
  startIdx: Int!
  endIdx: Int!
  value: String
  sequence: String
  tagged: [Tagged]
  isEnriched: Boolean
  metadata: Metadata
}

type Text {
  id: ID!
  name: String!
  source: String!
  date: String
  author: String
  characterCount: Int
  categories: [String]
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

const tag = (value, words, choiceSets) => {
  const lexed = new pos.Lexer().lex(value)
  const tagger = new pos.Tagger()
  const tagged = tagger.tag(lexed).map(t => ({ value: t[0], tag: t[1] }))

  tagged.forEach(t => {
    const isPunctuation = t.value === t.tag
    const isConnector = CONNECTORS.indexOf(t.value) > -1
    if (isPunctuation) {
      delete t.tag
      t.isPunctuation = true
    } else if (isConnector) {
      t.isConnector = true
    } else {
      const wordIdx = _u.findIndex(
        words.map(w => w.otherForms.concat(w.value)),
        w => w.indexOf(t.value) > -1
      )
      if (wordIdx > -1) {
        t.wordId = words[wordIdx]._id
      }
      const choiceSetIdx = _u.findIndex(
        choiceSets.map(c => c.choices),
        c => c.indexOf(t.value) > -1
      )
      if (choiceSetIdx > -1) {
        t.choiceSetId = choiceSets[choiceSetIdx]._id
      }
    }
  })

  return tagged
}

const getMetadataAttr = (text, str) => {
  const split = text.split(str)
  if (split.length > 1) {
    return split[1].split("%%")[0]
  }
}

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)

const parseTextMetadata = (tokenized, startIdx) => {
  let metadata = {}
  const before = tokenized.slice(0, startIdx)
  const lastIdx = _u.findLastIndex(before, s => s.indexOf("%%Source:") > -1)

  if (lastIdx > -1) {
    const text = before[lastIdx]
    const ATTRS = ["source", "name", "date", "author"]
    ATTRS.forEach(attr => {
      const str = capitalizeFirstLetter(attr) + ": "
      const res = getMetadataAttr(text, str)
      if (res) {
        metadata[attr] = res
      }
    })
  }

  return metadata
}

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
      const isMultipleSources = text.source === "multiple"
      const words = await WordModel.find({}, { value: 1, otherForms: 1 })
      const choiceSets = await ChoiceSetModel.find({}, { choices: 1 })

      let passages = text.passages
      const tokenized = JSON.parse(text.tokenized)

      const update = params.ranges.map(range => {
        const obj = {}
        obj.startIdx = range[0]
        obj.endIdx = range[1]
        const sentences = tokenized.slice(obj.startIdx, obj.endIdx)
        obj.value = sentences.join(" ")
        // TODO: - check
        obj.tagged = _u.flatten(
          sentences
            .map(s => tag(s, words, choiceSets))
            .reduce((a, v) => [...a, v, { isSentenceConnector: true }], [])
            .slice(0, -1)
        )
        if (isMultipleSources) {
          obj.metadata = parseTextMetadata(tokenized, obj.startIdx)
        }
        return obj
      })

      passages = passages.concat(update)
      const passagesCount = passages.length
      const unenrichedPassagesCount = passages.filter(p => !p.isEnriched).length

      return TextModel.findByIdAndUpdate(
        params.id,
        { $set: { passages, passagesCount, unenrichedPassagesCount } },
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
      const { tagged, id, value } = decoded

      const text = await TextModel.findOne({ "passages._id": id })
      const idx = _u.findIndex(text.passages, p => p._id.equals(id))

      text.passages[idx].value = value
      text.passages[idx].tagged = tagged
      text.passages[idx].isEnriched = true

      text.passagesCount = text.passages.length
      text.unenrichedPassagesCount = text.passages.filter(
        p => !p.isEnriched
      ).length

      return text.save()
    },
    async removeText(_, params) {
      return TextModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
