const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()

const PHYSICAL_STATES_ID = mongoose.Types.ObjectId()

const choiceSet = {
  _id: ID,
  name: "diet",
  category: "zoology",
  choices: ["herbivore", "carnivore", "omnivore"]
}

const choiceSet2 = {
  _id: PHYSICAL_STATES_ID,
  name: "states",
  category: "physics",
  choices: ["liquid", "gas", "solid", "nebula"]
}

module.exports = {
  mock: choiceSet,
  mocks: [choiceSet, choiceSet2],
  PHYSICAL_STATES_ID: PHYSICAL_STATES_ID
}
