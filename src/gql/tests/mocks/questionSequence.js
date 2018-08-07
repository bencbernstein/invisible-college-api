const mongoose = require("mongoose")

const questionSequence = {
  _id: mongoose.Types.ObjectId(),
  name: "test sequence",
  questions: require("./question").mocks.map(mock => mock._id)
}

module.exports = {
  mock: questionSequence,
  mocks: [questionSequence]
}
