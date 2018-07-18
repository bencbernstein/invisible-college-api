const { makeExecutableSchema } = require("graphql-tools")

const { userTypeDefs, userResolvers } = require("./schema/user")
const { textTypeDefs, textResolvers } = require("./schema/text")
const { wordTypeDefs, wordResolvers } = require("./schema/word")

module.exports = makeExecutableSchema({
  typeDefs: [userTypeDefs, textTypeDefs, wordTypeDefs],
  resolvers: [userResolvers, textResolvers, wordResolvers]
})
