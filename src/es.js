const elasticsearch = require("elasticsearch")

const CONFIG = require("./lib/config")

const client = new elasticsearch.Client({
  host: [
    {
      host: CONFIG.ES_HOST,
      auth: CONFIG.ES_AUTH,
      protocol: "https",
      port: 9243
    }
  ]
})

const hits = res => res["hits"]["hits"]
const firstHit = res => hits(res)[0]

const esTexts = async (index, search, size = 300) => {
  const query = search.length
    ? {
        bool: {
          should: [
            { regexp: { title: `.*${search}.*` } },
            { term: { join_field: "book" } }
          ],
          minimum_should_match: 2
        }
      }
    : { term: { join_field: "book" } }

  try {
    const res = await client.search({ index, body: { query }, size })
    return hits(res).map(({ _id, _source }) => ({
      id: _id,
      title: _source.title,
      sections_count: _source.sections_count
    }))
  } catch (error) {
    throw new Error(error.message)
  }
}

const esPassageInText = async (index, parentId, section) => {
  const res = await client.search({
    index,
    body: {
      query: {
        bool: {
          should: [
            { parent_id: { type: "passage", id: parentId } },
            { term: { section } }
          ],
          minimum_should_match: 2
        }
      }
    }
  })
  return firstHit(res)
}

const esText = async (index, _id) => {
  const textResult = await client.search({
    index,
    type: "_doc",
    body: { query: { term: { _id } } }
  })
  const text = firstHit(textResult)
  const esPassage = await esPassageInText(index, _id, 0)
  return { text, esPassage }
}

const esPassageById = (index, id) =>
  client.get({ index, type: "_doc", id, routing: 1 })

const esUpdateDoc = (index, id, body) =>
  client.update({ index, type: "_doc", id, body, routing: 1 }, (error, res) => {
    console.log(error, res)
    return true
  })

const esFindPassages = async (index, lcds, size = 300) => {
  const should = lcds.split(",").map(sentences => ({ match: { sentences } }))
  const query = { bool: { minimum_should_match: 1, should } }
  const highlight = {
    pre_tags: ["<span class='highlight'>"],
    post_tags: ["</span>"],
    fields: { sentences: {} }
  }
  const body = { query, highlight }
  const res = await client.search({ index, body, size })
  return hits(res)
}

const esIndexCounts = indexes =>
  client.count(
    { index: indexes },
    { body: { query: { term: { join_field: "book" } } } }
  )

module.exports = {
  esTexts,
  esText,
  esPassageById,
  esUpdateDoc,
  esFindPassages,
  esIndexCounts,
  esPassageInText
}
