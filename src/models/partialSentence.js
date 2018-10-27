const mongoose = require("mongoose")
const Schema = mongoose.Schema

const partialSentenceSchema = new Schema({
  value: { type: String, required: true },
  connector: { type: String, required: true },
  position: { type: String, required: true },
  passage: { type: Schema.Types.ObjectId, required: true }
})

const Model = mongoose.model("PartialSentence", partialSentenceSchema)
module.exports = Model
