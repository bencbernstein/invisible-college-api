var GraphQLNonNull = require("graphql").GraphQLNonNull
var GraphQLString = require("graphql").GraphQLString
var UserType = require("../../types/user")
var UserModel = require("../../../models/user")

exports.addUser = {
  type: UserType.userType,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve(root, params) {
    const user = new UserModel(params)
    user.save(err => {
      if (err) {
        console.log(err.message)
      }
    })
    return user
  }
}
