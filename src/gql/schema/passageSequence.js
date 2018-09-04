const _u = require("underscore")
const PassageSequenceModel = require("../../models/passageSequence")
const TextModel = require("../../models/text")

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
      return PassageSequenceModel.find().catch(err => new Error(err))
    },

    async passageSequence(_, params) {
      const passageSeq = await PassageSequenceModel.findById(params.id)
      const passageIds = passageSeq.passages

      const passageObjs = _u
        .flatten(
          (await TextModel.find({ "passages._id": passageIds })).map(
            t => t.passages
          )
        )
        .filter(p => passageIds.indexOf(p._id.toString()) > -1)

      const passages = passageIds.map(id =>
        _u.find(passageObjs, p => p._id.equals(id))
      )

      return passages
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
      const { passageId, id } = params

      const passageSeq = await PassageSequenceModel.findById(id)
      const passages = passageSeq.passages
      const passageIds = passages.concat(passageId).map(String)

      const passageObjs = _u
        .flatten(
          (await TextModel.find(
            {
              "passages._id": passageIds
            },
            { passages: 1, _id: 0 }
          )).map(t => t.passages)
        )
        .filter(p => passageIds.indexOf(p._id.toString()) > -1)

      const passageIdx = _u.findIndex(passageObjs, p => p._id.equals(passageId))
      const passage = passageObjs.splice(passageIdx, 1)

      const connectorCount = passage =>
        _u.flatten(passage.tagged).filter(t => t.isConnector).length

      const allConnectorCounts = passageObjs.map(connectorCount)
      const newConnectorCount = connectorCount(passage)

      const idx = allConnectorCounts
        .concat(newConnectorCount)
        .sort()
        .indexOf(newConnectorCount)

      passages.splice(idx, 0, passageId)
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
