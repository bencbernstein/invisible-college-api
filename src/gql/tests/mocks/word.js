const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

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
  obscurity: 5,
  images: []
}

const word2 = {
  _id: ID2,
  value: "nebula",
  isDecomposable: true,
  components: [
    {
      value: "nebul",
      isRoot: true
    },
    {
      value: "a",
      isRoot: false
    }
  ],
  definition: [
    {
      highlight: false,
      value: "a "
    },
    {
      highlight: true,
      value: " cloud"
    },
    {
      highlight: false,
      value: ", often used of large groups of stars"
    }
  ],
  obscurity: 5,
  tags: [
    {
      value: "lion",
      id: word._id,
      choiceSetIds: []
    }
  ],
  images: []
}

module.exports = {
  mock: word,
  mocks: [word, word2]
}
