const mongoose = require("mongoose")
const Schema = mongoose.Schema

var textSchema = new Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  tokenized: { type: String, required: true },
  passages: {
    type: [
      {
        startIdx: { type: Number, required: true, min: 0 },
        endIdx: { type: Number, required: true },
        passage: { type: String, required: true },
        found: { type: [String], required: true, default: [] }
      }
    ],
    default: []
  }
})

const Model = mongoose.model("Text", textSchema)
module.exports = Model
