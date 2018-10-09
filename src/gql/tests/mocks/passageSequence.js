const mongoose = require("mongoose")

const passages = require("./passage")
  .mocks.map(p => p._id)
  .slice(0, 1)

const passageSequence = {
  _id: mongoose.Types.ObjectId(),
  name: "Zoology Passage Sequence",
  count: passages.length,
  passages
}

module.exports = {
  mock: passageSequence,
  mocks: [passageSequence]
}
