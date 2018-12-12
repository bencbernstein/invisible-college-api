const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { wordTypeDefs, wordResolvers } = require("./schema/word")
const { choiceSetTypeDefs, choiceSetResolvers } = require("./schema/choiceSet")
const { keywordTypeDefs, keywordResolvers } = require("./schema/keyword")
const { questionTypeDefs, questionResolvers } = require("./schema/question")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { passageTypeDefs, passageResolvers } = require("./schema/passage")
const { imageTypeDefs, imageResolvers } = require("./schema/image")
const { queueTypeDefs, queueResolvers } = require("./schema/queue")

const {
  curriculumTypeDefs,
  curriculumResolvers
} = require("./schema/curriculum")

module.exports = makeExecutableSchema({
  typeDefs: [
    userTypeDefs,
    wordTypeDefs,
    textTypeDefs,
    passageTypeDefs,
    choiceSetTypeDefs,
    keywordTypeDefs,
    questionTypeDefs,
    imageTypeDefs,
    queueTypeDefs,
    curriculumTypeDefs
  ],
  resolvers: [
    userResolvers,
    wordResolvers,
    textResolvers,
    passageResolvers,
    choiceSetResolvers,
    keywordResolvers,
    questionResolvers,
    imageResolvers,
    queueResolvers,
    curriculumResolvers
  ]
})
