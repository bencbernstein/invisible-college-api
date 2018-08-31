const _ = require("underscore")

const ChoiceSetModel = require("../../models/choiceSet")
const WordModel = require("../../models/word")

const keywordTypeDefs = `
extend type Query {
  keywords: String
}
`

const keywordResolvers = {
  Query: {
    async keywords() {
      const keywords = {
        choices: {},
        words: {}
      }

      const words = await WordModel.find(
        {},
        { value: 1, _id: 1, otherForms: 1 }
      )

      words.forEach(wordDoc => {
        wordDoc.otherForms
          .concat(wordDoc.value)
          .forEach(word => (keywords.words[word] = wordDoc._id))
      })

      const choiceSets = await ChoiceSetModel.find({}, { choices: 1, _id: 1 })

      choiceSets.forEach(choiceSet => {
        choiceSet.choices.forEach(
          choice => (keywords.choices[choice] = choiceSet._id)
        )
      })

      return JSON.stringify(keywords)
    }
  }
}

module.exports = { keywordTypeDefs, keywordResolvers }
