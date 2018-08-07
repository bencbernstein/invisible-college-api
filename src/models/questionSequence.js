const mongoose = require("mongoose")
const Schema = mongoose.Schema

const questionSequenceSchema = new Schema({
  name: { type: String, required: true },
  questions: { type: [Schema.Types.ObjectId], required: true }
})

const Model = mongoose.model("QuestionSequence", questionSequenceSchema)
module.exports = Model
