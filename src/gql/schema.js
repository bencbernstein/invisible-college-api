const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { wordTypeDefs, wordResolvers } = require("./schema/word")
const { choiceSetTypeDefs, choiceSetResolvers } = require("./schema/choiceSet")
const { keywordTypeDefs, keywordResolvers } = require("./schema/keyword")
const { questionTypeDefs, questionResolvers } = require("./schema/question")

module.exports = makeExecutableSchema({
  typeDefs: [
    userTypeDefs,
    textTypeDefs,
    wordTypeDefs,
    choiceSetTypeDefs,
    keywordTypeDefs,
    questionTypeDefs
  ],
  resolvers: [
    userResolvers,
    textResolvers,
    wordResolvers,
    choiceSetResolvers,
    keywordResolvers,
    questionResolvers
  ]
})
