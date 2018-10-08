const mongoose = require("mongoose")
const pos = require("pos")
const { flatten, findIndex } = require("underscore")

const PassageModel = require("../../models/passage")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")

const CONNECTORS = flatten(require("../../lib/connectors").map(c => c.elements))

const passageTypeDefs = `
extend type Query {
  passage(id: ID!): Passage
}

extend type Query {
  passages: [Passage]
}

extend type Mutation {
  savePassages (
    passages: String!
  ): [Passage]   

  filterPassage (
    id: String!,
    status: String!,
    indices: String
  ): Passage

  updatePassage2 (
    update: String!
    status: String!
  ): Passage
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
      const wordIdx = findIndex(words, w => w.indexOf(t.value) > -1)
      if (wordIdx > -1) {
        t.wordId = words[wordIdx]._id
      }
      const choiceSetIdx = findIndex(choiceSets, c => c.indexOf(t.value) > -1)
      if (choiceSetIdx > -1) {
        t.choiceSetId = choiceSets[choiceSetIdx]._id
      }
    }
  })
  return tagged
}

const convert = (data, words, choiceSets) => {
  const { source, title, matchIdx, context } = data
  const _id = mongoose.Types.ObjectId()
  const value = context.join(" ")
  const status = "unfiltered"
  const tagged = flatten(
    context
      .map(s => tag(s, words, choiceSets))
      .reduce((a, v) => [...a, v, { isSentenceConnector: true }], [])
      .slice(0, -1)
  )
  return {
    _id,
    source,
    title,
    matchIdx,
    value,
    status,
    tagged
  }
}

const passageResolvers = {
  Query: {
    passages() {
      return PassageModel.find().catch(err => new Error(err))
    },

    passage(_, params) {
      return PassageModel.findById(params.id).catch(err => new Error(err))
    }
  },
  Mutation: {
    async savePassages(_, params) {
      let words = await WordModel.find({}, { value: 1, otherForms: 1 })
      words = words.map(w => w.otherForms.concat(w.value))
      let choiceSets = await ChoiceSetModel.find({}, { choices: 1 })
      choiceSets = choiceSets.map(c => c.choices)

      const decoded = JSON.parse(decodeURIComponent(params.passages))
      const wordToPassageIds = {}
      const passages = decoded.map(data => convert(data, words, choiceSets))

      passages.forEach(p =>
        p.tagged.forEach(w => {
          if (w.wordId) {
            if (wordToPassageIds[w.wordId]) {
              if (wordToPassageIds[w.wordId].indexOf(p._id) === -1) {
                wordToPassageIds[w.wordId].push(p._id)
              }
            } else {
              wordToPassageIds[w.wordId] = [p._id]
            }
          }
        })
      )

      Object.keys(wordToPassageIds).map(id =>
        WordModel.findByIdAndUpdate(id, {
          $push: { passages: { $each: wordToPassageIds[id] } },
          $inc: { unfilteredPassagesCount: wordToPassageIds[id].length }
        })
      )

      return PassageModel.create(passages).catch(err => new Error(err))
    },
    async filterPassage(_, params) {
      const { id, indices, status } = params
      const passage = await PassageModel.findById(id)

      if (indices) {
        passage.filteredSentences = indices
          .split(",")
          .map(str => parseInt(str, 10))
          .sort()
      }

      WordModel.updatePassageStatus(id, passage.status, status)
      passage.status = status

      try {
        await passage.save()
        return passage
      } catch (error) {
        return new Error(error)
      }
    },
    async updatePassage2(_, params) {
      const { update, status } = params
      const decoded = JSON.parse(decodeURIComponent(params.update))
      await WordModel.updatePassageStatus(decoded.id, decoded.status, status)
      decoded.status = status
      return PassageModel.findByIdAndUpdate(decoded.id, decoded, {
        new: true
      })
    }
  }
}

module.exports = { passageTypeDefs, passageResolvers }
