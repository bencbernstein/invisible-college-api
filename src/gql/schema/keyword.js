const _ = require("underscore")

const ChoiceSetModel = require("../../models/choiceSet")
const WordModel = require("../../models/word")

const keywordTypeDefs = `
type Keywords {
  words: [String]!
  choices: [String]!
}

extend type Query {
  keywords: Keywords
}
`

const keywordResolvers = {
  Query: {
    async keywords() {
      let words = await WordModel.find({}, { value: 1, _id: 0 })
      words = words.map(w => w.value)
      let choices = await ChoiceSetModel.find({}, { choices: 1, _id: 0 })
      choices = _.uniq(_.flatten(choices.map(c => c.choices)))
      return { words, choices }
    }
  }
}

module.exports = { keywordTypeDefs, keywordResolvers }
