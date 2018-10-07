const _ = require("underscore")
const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { seedDb } = require("../../test/helpers")
const schema = require("./../schema")

const wordMock = require("./mocks/word").mock
const passageMocks = require("./mocks/passage").mocks

const newPassage1 = {
  context: [
    `June 24 – ${
      wordMock.value
    } Battle of Solferino: The Kingdom of Sardinia and the armies of Napoleon III of France defeat Franz Joseph I of Austria in northern Italy; the battle inspires Henri Dunant to found the Red Cross.`,
    "June 30 – Charles Blondin crosses Niagara Falls on a tightrope, for the first time.",
    "=== July–September === July Count Camillo Benso di Cavour resigns, as president of Piedmont-Sardinia.",
    "Pike's Peak Gold Rush begins in the Colorado Territory.",
    "July 1 – The first intercollegiate baseball game is played, between Amherst and Williams Colleges.",
    "July 8 Charles XV succeeds his father Oscar I of Sweden and Norway (as Charles IV).",
    "An armistice is declared, between Austria and France."
  ],
  status: "unfiltered",
  matchIdx: 3,
  title: "1859",
  source: "Wikipedia"
}

const newPassage2 = {
  context: [
    "Complete life cycles have been worked out for only 25 species.",
    "Having been expelled by the female, the acanthocephalan egg is released along with the feces of the host.",
    "For development to occur, the egg, containing the acanthor, needs to be ingested by an arthropod, usually a crustacean (there is one known life cycle which uses a mollusc as a first intermediate host).",
    "Inside the intermediate host, the acanthor is released from the egg and develops into an acanthella.",
    "It then penetrates the gut wall, moves into the body cavity, encysts, and begins transformation into the infective cystacanth stage."
  ],
  matchIdx: 2,
  title: "Acanthocephala",
  source: "Wikipedia"
}

describe("passages", () => {
  beforeEach(async () => await seedDb())

  it("returns passage from the db", async function() {
    const query = `
      query {
        passages {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { passages } = result.data

    chai.assert.equal(passages.length, passageMocks.length)
  })

  it("saves passages to the db", async function() {
    const newPassages = [newPassage1, newPassage2]
    const encoded = encodeURIComponent(JSON.stringify(newPassages))
    const query = `
      mutation {
        savePassages(passages: "${encoded}") {
          id
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { savePassages } = result.data

    chai.assert.equal(savePassages.length, newPassages.length)
  })

  it.only("saves sentence indices for a passage", async function() {
    const id = passageMocks[0]._id
    const indices = [1, 0]
    const query = `
      mutation {
        filterPassage(id: "${id}", indices: "${indices.join(",")}") {
          id
          filteredSentences
          status
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { filterPassage } = result.data
    chai.assert.deepEqual(filterPassage.filteredSentences, indices.sort())
    chai.assert.deepEqual(filterPassage.status, "accepted")
  })

  it.only("rejects a passage", async function() {
    const id = passageMocks[0]._id
    const query = `
      mutation {
        filterPassage(id: "${id}") {
          id
          filteredSentences
          status
        }
      }
    `

    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { filterPassage } = result.data
    chai.assert.equal(filterPassage.filteredSentences.length, 0)
    chai.assert.deepEqual(filterPassage.status, "rejected")
  })
})
