const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()

const user = {
  _id: ID,
  email: "akiva@playwordcraft.com",
  password: "super-secret-password",
  firstName: "Akiva",
  lastName: "Saunders"
}

module.exports = {
  mock: user,
  mocks: [user]
}
