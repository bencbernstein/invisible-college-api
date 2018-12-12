const mongoose = require("mongoose")
const Schema = mongoose.Schema

const choiceSetSchema = new Schema({
  name: { type: String, required: true },
  choices: {
    type: [String],
    required: true,
    default: []
  }
})

const Model = mongoose.model("ChoiceSet", choiceSetSchema)
module.exports = Model
