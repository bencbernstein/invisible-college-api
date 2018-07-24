const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { wordTypeDefs, wordResolvers } = require("./schema/word")
const { choiceSetTypeDefs, choiceSetResolvers } = require("./schema/choiceSet")

module.exports = makeExecutableSchema({
  typeDefs: [userTypeDefs, textTypeDefs, wordTypeDefs, choiceSetTypeDefs],
  resolvers: [userResolvers, textResolvers, wordResolvers, choiceSetResolvers]
})
