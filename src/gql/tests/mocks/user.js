const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const user = {
  _id: ID,
  email: "akiva@playwordcraft.com",
  password: "super-secret-password",
  firstName: "Akiva",
  lastName: "Saunders",
  bookmarks: [
    {
      textId: ID2,
      sentenceIdx: 350
    }
  ],
  words: [
    {
      id: mongoose.Types.ObjectId(),
      value: "herbivore",
      seenCount: 1,
      correctCount: 1,
      experience: 1
    }
  ],
  passages: []
}

module.exports = {
  mock: user,
  mocks: [user]
}
