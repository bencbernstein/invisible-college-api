const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const image = {
  _id: ID,
  caption: "a sleepy place",
  location: "My bedroom",
  buf: new Buffer("test"),
  words: [ID2]
}

module.exports = {
  mock: image,
  mocks: [image]
}
