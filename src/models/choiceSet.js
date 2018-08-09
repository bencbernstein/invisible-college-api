const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categories = require("../lib/categories")

const choiceSetSchema = new Schema({
  name: { type: String, required: true },
  categories: {
    type: [
      {
        type: String,
        enum: categories
      }
    ]
  },
  choices: {
    type: [String],
    required: true,
    default: []
  }
})

const Model = mongoose.model("ChoiceSet", choiceSetSchema)
module.exports = Model
