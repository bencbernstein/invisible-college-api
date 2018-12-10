const mongoose = require("mongoose")
const pos = require("pos")
const elasticsearch = require("elasticsearch")
const { flatten } = require("lodash")

const PassageModel = require("../../models/passage")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")
const QueueModel = require("../../models/queue")

const CONNECTORS = flatten(require("../../lib/connectors").map(c => c.elements))
const { consecutiveGroups } = require("../../lib/helpers")

const client = new elasticsearch.Client({
  host: [
    {
      host: "ee2174119d634def91a0a4b2a91c19e4.us-east-1.aws.found.io",
      auth: "elastic:3y44M8nGXMrppI9OQWikcxZZ",
      protocol: "https",
      port: 9243
    }
  ]
})

const queueTypeDefs = `
type Passage2 {
  id: ID!
  factoidOnCorrect: Boolean!
  tagged: [Tagged2]!
  source: String
  title: String
  esId: ID!
}

type Tagged2 {
  id: ID
  value: String
  pos: String
  isFocusWord: Boolean
  isPunctuation: Boolean
  isSentenceConnector: Boolean
  isConnector: Boolean
  isUnfocused: Boolean
  wordId: String
  choiceSetId: String
}

type Decision {
  indexes: [Int]
  accepted: Boolean
  id: ID
  userId: ID
  userAccessLevel: Int
}

type QueueItem {
  id: ID!
  tags: [String]
  decisions: [Decision]
}

type Queue {
  id: ID!
  entity: String!
  type: String!
  items: [QueueItem]
  createdOn: String
  accessLevel: Int
}

extend type Mutation {
  createQueue (
    data: String!
  ): Boolean

  deleteQueue (
    id: String!
  ): Boolean

  updateQueueItem(
    id: String!,
    index: String!,
    update: String!
  ): Queue

  finishedQueue(
    id: String!
  ): Boolean
}

extend type Query {
  queues: [Queue]
}
`

const queueResolvers = {
  Query: {
    queues() {
      return QueueModel.find()
    }
  },
  Mutation: {
    async createQueue(_, params) {
      const queue = JSON.parse(decodeURIComponent(params.data))
      queue.createdOn = new Date()
      const result = await QueueModel.create(queue)
      return true
    },

    async updateQueueItem(_, params) {
      const index = parseInt(params.index, 10)
      const update = {}
      update["items." + index] = JSON.parse(decodeURIComponent(params.update))
      return QueueModel.findByIdAndUpdate(
        params.id,
        { $set: update },
        { new: true }
      )
    },

    async finishedQueue(_, params) {
      const queue = await QueueModel.findById(params.id)
      // Filter accepted items
      const items = queue.items.filter(
        ({ decisions }) => decisions.length && decisions[0].accepted
      )
      // Get content from Elasticsearch
      const results = await client.mget({
        index: "simple_english_wikipedia",
        type: "_doc",
        body: { ids: items.map(({ id }) => id) },
        _sourceInclude: ["sentences", "title", "source"],
        routing: 1
      })
      const passages = []
      // Divide non-contiguous sentences
      for (const item of items) {
        const doc = results.docs.find(d => d._id === item.id)
        if (!doc) return
        const { title, source, sentences } = doc._source
        const decision = item.decisions[0]
        const indexGroups = consecutiveGroups(decision.indexes)
        // Pre-process content
        for (const indexGroup of indexGroups) {
          const filtered = indexGroup.map(i => sentences[i])
          const words = await WordModel.allForms() // TODO: - cache?
          const choiceSets = await ChoiceSetModel.find({}, { choices: 1 })
          const tagged = tagSentences(filtered, words, choiceSets)
          passages.push({
            _id: mongoose.Types.ObjectId(),
            tagged,
            title,
            source,
            esId: item.id,
            factoidOnCorrect: false
          })
        }
      }

      const enrichQueue = {
        entity: "passage",
        type: "enrich",
        createdOn: new Date(),
        accessLevel: 1,
        items: passages.map(({ _id }) => ({ id: _id, decisions: [] }))
      }

      await PassageModel.create(passages)
      await QueueModel.create(enrichQueue)

      // Turn off filter queue
      // Set up user for enrich queue

      return true
    },

    async deleteQueue(_, params) {
      await QueueModel.findByIdAndDelete(params.id)
      return true
    }
  }
}

const tagSentences = (sentences, words, choiceSets) =>
  flatten(
    sentences
      .map(sentence => tagSentence(sentence, words, choiceSets))
      .reduce((a, v) => [...a, v, { isSentenceConnector: true }], [])
      .slice(0, -1)
  )

const tagSentence = (sentence, words, choiceSets) => {
  const lexed = new pos.Lexer().lex(sentence)
  const tagger = new pos.Tagger()
  const tagged = tagger.tag(lexed).map(t => ({ value: t[0], pos: t[1] }))

  tagged.forEach(tag => {
    if (tag.value === tag.pos) {
      delete tag.pos
      tag.isPunctuation = true
    } else if (CONNECTORS.indexOf(tag.value) > -1) {
      tag.isConnector = true
    } else {
      const wordIdx = words.findIndex(w => w.values.indexOf(tag.value) > -1)
      if (wordIdx > -1) {
        tag.wordId = words[wordIdx]._id
      }
      const choiceSetIdx = choiceSets.findIndex(
        c => c.choices.indexOf(tag.value) > -1
      )
      if (choiceSetIdx > -1) {
        tag.choiceSetId = choiceSets[choiceSetIdx]._id
      }
    }
  })

  return tagged
}

module.exports = { queueTypeDefs, queueResolvers }
