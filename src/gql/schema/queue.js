const QueueModel = require("../../models/queue")

const queueTypeDefs = `
type QueueItem {
  id: ID!
  matches: [String]!
}

type Queue {
  entity: String!
  type: String!
  items: [QueueItem]
}

extend type Mutation {
  createQueue (
    data: String!
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
      console.log(params)
      const queue = JSON.parse(decodeURIComponent(params.data))
      console.log(queue)
      const result = await QueueModel.create(queue)
      console.log(result)
      return true
    }
  }
}

module.exports = { queueTypeDefs, queueResolvers }
