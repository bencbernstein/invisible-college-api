const mongoose = require("mongoose")

const passageSequence = {
  _id: mongoose.Types.ObjectId(),
  name: "Zoology Passage Sequence",
  count: 1,
  passages: [require("./text").mock.passages[0]._id]
}

module.exports = {
  mock: passageSequence,
  mocks: [passageSequence]
}
