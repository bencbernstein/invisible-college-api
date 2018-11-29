const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { wordTypeDefs, wordResolvers } = require("./schema/word")
const { choiceSetTypeDefs, choiceSetResolvers } = require("./schema/choiceSet")
const { keywordTypeDefs, keywordResolvers } = require("./schema/keyword")
const { questionTypeDefs, questionResolvers } = require("./schema/question")
const { passageTypeDefs, passageResolvers } = require("./schema/passage")
const { imageTypeDefs, imageResolvers } = require("./schema/image")
const { queueTypeDefs, queueResolvers } = require("./schema/queue")

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
    passageTypeDefs,
    imageTypeDefs,
    queueTypeDefs
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
    passageResolvers,
    imageResolvers,
    queueResolvers
  ]
})
