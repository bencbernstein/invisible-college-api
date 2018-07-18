const mongoose = require("mongoose")
const Schema = mongoose.Schema

var textSchema = new Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  tokenized: { type: String, required: true }
})

const Model = mongoose.model("Text", textSchema)
module.exports = Model
