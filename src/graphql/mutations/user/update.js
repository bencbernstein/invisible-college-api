var GraphQLNonNull = require("graphql").GraphQLNonNull
var GraphQLString = require("graphql").GraphQLString
var UserType = require("../../types/user")
var UserModel = require("../../../models/user")

exports.updateUser = {
  type: UserType.userType,
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve(root, params) {
    return UserModel.findByIdAndUpdate(
      params.id,
      { $set: { email: params.email } },
      { new: true }
    ).catch(err => new Error(err))
  }
}
