const elasticsearch = require("elasticsearch")

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

const textTypeDefs = `
type Section {
  sentences: [String]!
  source: String!
  title: String!
  section: Int!
}

type Highlight {
  sentences: [String]!
}

type Hit {
  _index: String
  _type: String
  _id: String
  _score: Float
  _source: Section
  highlight: Highlight
}

type Text {
  id: ID!
  title: String
  sentences: [String]
}

extend type Query {
  texts(index: String!, search: String): [Text]
  text(id: ID!, query: String): Text
  findPassages(lcds: String!): [Hit]
}

extend type Mutation {
  updateText(id: ID!, update: String!): Boolean
}
`

const textResolvers = {
  Query: {
    async texts(_, params) {
      const { index, search } = params

      const query = search.length
        ? { regexp: { title: `.*${search}.*` } }
        : { exists: { field: "title" } }

      try {
        const res = await client.search({
          index,
          body: { query },
          size: 300
        })
        return res.hits.hits.map(({ _id, _source }) => ({
          id: _id,
          title: _source.title
        }))
      } catch (error) {
        throw new Error(error.message)
      }
    },

    async text(_, params) {
      const { id } = params

      const textResult = await client.search({
        index: "my_index",
        type: "_doc",
        body: { query: { term: { _id: id } } }
      })

      const text = textResult["hits"]["hits"][0]
      const title = text._source.title

      const passageResult = await client.search({
        index: "my_index",
        body: { query: { parent_id: { type: "passage", id } } }
      })

      const sentenceGroups = passageResult["hits"]["hits"].map(
        doc => doc._source.sentences
      )

      return { id, title }
    },

    async findPassages(_, params) {
      const { lcds } = params
      const should = lcds
        .split(",")
        .map(sentences => ({ match: { sentences } }))
      const query = { bool: { minimum_should_match: 1, should } }
      const highlight = {
        pre_tags: ["<span class='highlight'>"],
        post_tags: ["</span>"],
        fields: { sentences: {} }
      }
      const body = { query, highlight }

      const res = await client.search({
        index: "simple_english_wikipedia",
        body,
        size: 300
      })

      return res["hits"]["hits"]
    }
  },
  Mutation: {
    async updateText(_, params) {
      const { id, update } = params
      const doc = JSON.parse(decodeURIComponent(update))
      client.update(
        { index: "my_index", type: "_doc", id, body: doc, routing: 1 },
        (error, res) => {
          console.log(error, res)
          return true
        }
      )
    }
  }
}

module.exports = { textTypeDefs, textResolvers }
