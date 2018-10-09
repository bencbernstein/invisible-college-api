const { findIndex, flatten, without } = require("underscore")
const PassageSequenceModel = require("../../models/passageSequence")
const TextModel = require("../../models/text")
const PassageModel = require("../../models/passage")

const passageSequenceTypeDefs = `
type PassageSequence {
  id: ID
  name: String!
  count: Int!
  passages: [String]!
}

extend type Query {
  passageSequences: [PassageSequence]
  passageSequence(id: ID!): [Passage]
}

extend type Mutation {
  updatePassageSequence (
    id: ID!
    passages: String!
  ): PassageSequence

  addPassageToPassageSequence (
    id: ID!
    passageId: String!
  ): PassageSequence  

  removePassageFromPassageSequence (
    id: ID!
    passageId: String!
  ): PassageSequence    

  createPassageSequence (
    name: String!
  ): PassageSequence

  removePassageSequence (
    id: ID!
  ): PassageSequence
}
`

const passageSequenceResolvers = {
  Query: {
    passageSequences() {
      return PassageSequenceModel.find()
    },

    async passageSequence(_, params) {
      const passageSeq = await PassageSequenceModel.findById(params.id)
      return PassageModel.find({ _id: { $in: passageSeq.passages } })
    }
  },
  Mutation: {
    createPassageSequence(_, params) {
      return PassageSequenceModel.create(params)
    },

    removePassageSequence(_, params) {
      return PassageSequenceModel.findByIdAndRemove(params.id)
    },

    updatePassageSequence(_, params) {
      const passages = JSON.parse(decodeURIComponent(params.passages))
      const count = passages.length
      return PassageSequenceModel.findByIdAndUpdate(
        params.id,
        { $set: { passages, count } },
        { new: true }
      ).catch(err => new Error(err))
    },

    async addPassageToPassageSequence(_, params) {
      const { id, passageId } = params
      const passageSeq = await PassageSequenceModel.findById(id)
      const ids = passageSeq.passages.concat(passageId).map(String)
      const passages = await PassageModel.find({ _id: { $in: ids } })

      const passageIdx = findIndex(passages, p => p._id.equals(passageId))
      const passage = passages.splice(passageIdx, 1)[0]

      const allCounts = passages.map(d => d.connectorCount())
      const newCount = passage.connectorCount()

      const idx = allCounts
        .concat(newCount)
        .sort()
        .indexOf(newCount)

      passages.splice(idx, 0, passageId)
      const count = passages.length

      return PassageSequenceModel.findByIdAndUpdate(
        params.id,
        { $set: { passages, count } },
        { new: true }
      ).catch(err => new Error(err))
    },

    async removePassageFromPassageSequence(_, params) {
      const { id, passageId } = params
      const passageSeq = await PassageSequenceModel.findById(id)
      const passages = without(passageSeq.passages.map(String), passageId)
      const count = passages.length

      return PassageSequenceModel.findByIdAndUpdate(
        params.id,
        { $set: { passages, count } },
        { new: true }
      ).catch(err => new Error(err))
    }
  }
}

module.exports = { passageSequenceTypeDefs, passageSequenceResolvers }
