const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()

const choiceSet = {
  _id: ID,
  name: "diet",
  category: "zoology",
  choices: ["herbivore", "carnivore", "omnivore"]
}

module.exports = {
  mock: choiceSet,
  mocks: [choiceSet]
}
