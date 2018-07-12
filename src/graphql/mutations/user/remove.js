var GraphQLNonNull = require("graphql").GraphQLNonNull
var GraphQLString = require("graphql").GraphQLString
var UserType = require("../../types/user")
var UserModel = require("../../../models/user")

exports.removeUser = {
  type: UserType.userType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve(root, params) {
    const removedUser = UserModel.findByIdAndRemove(params.id).exec()
    if (!removedUser) {
      throw new Error("Error")
    }
    return removedUser
  }
}
