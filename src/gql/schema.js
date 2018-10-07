const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { wordTypeDefs, wordResolvers } = require("./schema/word")
const { choiceSetTypeDefs, choiceSetResolvers } = require("./schema/choiceSet")
const { keywordTypeDefs, keywordResolvers } = require("./schema/keyword")
const { questionTypeDefs, questionResolvers } = require("./schema/question")
const { passageTypeDefs, passageResolvers } = require("./schema/passage")

const {
  questionSequenceTypeDefs,
  questionSequenceResolvers
} = require("./schema/questionSequence")

const {
  passageSequenceTypeDefs,
  passageSequenceResolvers
} = require("./schema/passageSequence")

module.exports = makeExecutableSchema({
  typeDefs: [
    userTypeDefs,
    textTypeDefs,
    wordTypeDefs,
    choiceSetTypeDefs,
    keywordTypeDefs,
    questionTypeDefs,
    questionSequenceTypeDefs,
    passageSequenceTypeDefs,
    passageTypeDefs
  ],
  resolvers: [
    userResolvers,
    textResolvers,
    wordResolvers,
    choiceSetResolvers,
    keywordResolvers,
    questionResolvers,
    questionSequenceResolvers,
    passageSequenceResolvers,
    passageResolvers
  ]
})
