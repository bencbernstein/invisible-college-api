const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const choiceSet = {
  _id: ID,
  name: "diet",
  category: "zoology",
  choices: ["herbivore", "carnivore", "omnivore"]
}

const choiceSet2 = {
  _id: ID2,
  name: "states",
  category: "physics",
  choices: ["liquid", "gas", "solid"]
}

module.exports = {
  mock: choiceSet,
  mocks: [choiceSet, choiceSet2]
}
