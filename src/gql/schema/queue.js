const mongoose = require("mongoose")
const pos = require("pos")
const elasticsearch = require("elasticsearch")
const { flatten, get } = require("lodash")

const PassageModel = require("../../models/passage")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")
const QueueModel = require("../../models/queue")

const CONNECTORS = flatten(require("../../lib/connectors").map(c => c.elements))
const { consecutiveGroups } = require("../../lib/helpers")

const {
  createPassageQuestions
} = require("../../services/questionGenerators/sentence/index")

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
  curriculumId: ID
  part: Int
  curriculum: String
}

extend type Mutation {
  createQueues (
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

  finishedEnrichQueue(
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
      return QueueModel.find({ completed: false })
    }
  },
  Mutation: {
    async createQueues(_, params) {
      const queues = JSON.parse(decodeURIComponent(params.data))
      queues.forEach(queue => (queue.createdOn = Date.now()))
      await QueueModel.create(queues)
      return true
    },

    async updateQueueItem(_, params) {
      const index = parseInt(params.index, 10)
      let update = {}
      update["items." + index] = params.update
        ? JSON.parse(decodeURIComponent(params.update))
        : 1
      update = params.update ? { $set: update } : { $unset: update }
      await QueueModel.findByIdAndUpdate(params.id, update, { new: true })
      const pull = { $pull: { items: null } }
      return QueueModel.findByIdAndUpdate(params.id, pull, { new: true })
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
            curriculumId: queue.curriculumId,
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
        createdOn: Date.now(),
        accessLevel: queue.accessLevel,
        curriculumId: queue.curriculumId,
        curriculum: queue.curriculum,
        part: queue.part,
        items: passages.map(({ _id }) => ({ id: _id, decisions: [] }))
      }

      // TODO: - set up user for enrich queue
      await QueueModel.findByIdAndUpdate(params.id, {
        $set: { completed: true }
      })
      await PassageModel.create(passages)
      await QueueModel.create(enrichQueue)

      return true
    },

    async finishedEnrichQueue(_, params) {
      const queue = await QueueModel.findById(params.id)
      const ids = queue.items.map(({ id }) => id)

      await PassageModel.updateMany(
        { _id: { $in: ids } },
        {
          $set: { enriched: true }
        }
      )

      // TODO: - is this the right place?
      ids.forEach(createPassageQuestions)

      await QueueModel.findByIdAndUpdate(params.id, {
        $set: { completed: true }
      })

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

  const tagged = tagger.tag(lexed).map(tag => {
    const [value, pos] = tag
    const isPunctuation = value === pos
    const isConnector = CONNECTORS.includes(value)
    const isUnfocused = isConnector
    const wordId = get(words.find(w => w.values.includes(value)), "_id")
    const choiceSetId = get(
      choiceSets.find(c => c.choices.includes(value)),
      "_id"
    )
    return {
      value,
      pos,
      isPunctuation,
      isConnector,
      wordId,
      choiceSetId,
      isUnfocused
    }
  })

  return tagged
}

module.exports = { queueTypeDefs, queueResolvers }
