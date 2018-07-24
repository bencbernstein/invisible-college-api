const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()

const word = {
  _id: ID,
  value: "lion",
  isDecomposable: false,
  definition: [
    {
      highlight: false,
      value: "a large African cat"
    }
  ],
  obscurity: 5
}

module.exports = {
  mock: word,
  mocks: [word]
}
