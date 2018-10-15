const _ = require("underscore")
const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const schema = require("./../schema")
const Word = require("../../models/word")

const word = require("./mocks/word").mock
const wordMocks = require("./mocks/word").mocks

const newWord = "factory"
const definition =
  "building or group of buildings where goods are manufactured or assembled chiefly by machine"

describe("words", () => {
  beforeEach(async () => await seedDb())

  it("return 1 word with 1 word in the db", async function() {
    const query = `
      query {
        words {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { words } = result.data

    chai.assert.equal(words.length, wordMocks.length)
  })

  describe("sorting", () => {
    const attrs = ["value", "enrichedPassagesCount"]
    const startingWith = "n"

    attrs.forEach(attr => {
      it(`returns word sorted by ${attr}`, async function() {
        const length = 5
        const query = `
          query {
            words(first: ${length}, startingWith: "${startingWith}", sortBy: "${attr}") {
              ${attr}
            }
          }
        `

        const rootValue = {}
        const context = {}

        const result = await graphql(schema, query, rootValue, context)
        const words = result.data.words.map(w => w[attr])

        let mocks = wordMocks.map(w => w[attr]).sort()
        if (attr !== "value") {
          mocks = mocks.reverse()
        }
        mocks = mocks.slice(0, length)

        chai.assert.deepEqual(words, mocks)
      })
    })

    it("paginates", async function() {
      const length = 5
      const startingWith = "n"
      const mocks = wordMocks.map(w => w.value).sort()

      const query = `
        query {
          words(first: ${length}, startingWith: "${startingWith}", sortBy: "value") {
            value
          }
        }
      `

      const rootValue = {}
      const context = {}

      const result = await graphql(schema, query, rootValue, context)
      const words = result.data.words.map(w => w.value)

      chai.assert.deepEqual(words, mocks.slice(2, 7))
    })
  })

  it("finds a word by its id", async function() {
    const query = `
      query {
        word (id: "${word._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const found = result.data.word

    chai.assert.equal(found.id, word._id.toString())
  })

  it("finds words by their values", async function() {
    const values = wordMocks.slice(0, 3).map(doc => doc.value)

    const query = `
      query {
        wordsByValues (values: "${values.join(",")}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { wordsByValues } = result.data

    chai.assert.equal(values.length, wordsByValues.length)
  })

  // it("enriches a value", async function() {
  //   const word = "magnanimous"

  //   const query = `
  //     mutation {
  //       enrichWord (value: "${word}") {
  //         value
  //         definition
  //         synonyms
  //         tags
  //         lemmas
  //       }
  //     }
  //   `

  //   const rootValue = {}
  //   const context = {}

  //   const result = await graphql(schema, query, rootValue, context)
  //   const enriched = result.data.enrichWord

  //   console.log(result)

  //   chai.assert.equal(2, 2)
  // })

  // it("enriches a value", async function() {
  //   const query = `
  //     mutation {
  //       enrichWord (value: "${newWord}") {
  //         value
  //         definition
  //         synonyms
  //         tags
  //       }
  //     }
  //   `

  //   const rootValue = {}
  //   const context = {}

  //   const result = await graphql(schema, query, rootValue, context)
  //   const enriched = result.data.enrichWord

  //   chai.assert.equal(enriched.value, newWord)
  //   chai.assert.equal(enriched.definition, definition)
  // })

  // it("automatically enriches a new word", async function() {
  //   const query = `
  //     mutation {
  //       addWord (value: "${newWord}") {
  //         id
  //         unverified {
  //           definition
  //         }
  //       }
  //     }
  //   `

  //   const rootValue = {}
  //   const context = {}

  //   const result = await graphql(schema, query, rootValue, context)
  //   const enriched = result.data.addWord

  //   chai.assert.equal(enriched.unverified.definition, definition)
  // })

  it("updates a word", async function() {
    const encoded = encodeURIComponent(
      JSON.stringify(_.extend({}, word, { obscurity: 2, id: word._id }))
    )

    const query = `
      mutation {
        updateWord (word: "${encoded}") {
          id
          obscurity
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const updated = result.data.updateWord

    chai.assert.equal(updated.obscurity, 2)
    chai.assert.equal(updated.id, word._id.toString())
  })

  it("remove a word", async function() {
    const query = `
      mutation {
        removeWord (id: "${word._id}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const removed = result.data.removeWord

    chai.assert.equal(removed.id, word._id.toString())
  })

  it("gets all the keywords", async function() {
    const query = `
      query {
        keywords
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { words, choices } = JSON.parse(result.data.keywords)

    chai.assert.isNotEmpty(words)
    chai.assert.isNotEmpty(choices)
  })

  it("gets word ids to enrich for an attribute", async function() {
    const attr = "synonyms"

    const query = `
    query {
      wordsToEnrich(attr: "${attr}") {
        id
        ${attr}
      }
    }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { wordsToEnrich } = result.data

    chai.assert.equal(
      wordsToEnrich.length,
      wordMocks.filter(m => m.synonyms.length === 0).length
    )

    wordsToEnrich.forEach(word => {
      chai.assert.isEmpty(word[attr])
    })
  })

  it("gets passages for a word", async function() {
    const query = `
    query {
      passagesForWord(value: "${word.value}") {
        id
        value
      }
    }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { passagesForWord } = result.data

    chai.assert.equal(passagesForWord.length, word.passages.length)
    chai.assert.include(word.passages, passagesForWord[0].id)
  })

  it("recommends available passage queus", async function() {
    const type = "unfiltered"
    const limit = 10
    const query = `
    query {
      recommendPassageQueues(type: "${type}", limit: ${limit})
    }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { recommendPassageQueues } = result.data

    chai.assert.isNotEmpty(recommendPassageQueues)
    //
    // Not the best test - it passes, but it's not really accounting for ties
    chai.assert.deepEqual(
      recommendPassageQueues.sort(),
      wordMocks
        .filter(m => m.unfilteredPassagesCount > 0)
        .map(m => m.value)
        .sort()
        .slice(0, limit)
    )
  })
})
