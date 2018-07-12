var GraphQLObjectType = require("graphql").GraphQLObjectType
var GraphQLList = require("graphql").GraphQLList
var UserModel = require("../../models/user")
var userType = require("../types/user").userType

// Query
exports.queryType = new GraphQLObjectType({
  name: "Query",
  fields: function() {
    return {
      users: {
        type: new GraphQLList(userType),
        resolve: async () => {
          const users = await UserModel.find()
          if (!users) {
            throw new Error("Error")
          }
          return users
        }
      }
    }
  }
})
