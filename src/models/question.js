const mongoose = require("mongoose")
const Schema = mongoose.Schema

const questionSchema = new Schema({
  TYPE: { type: String, required: true },
  prompt: {
    type: [
      {
        value: { type: String, required: true },
        highlight: { type: Boolean, required: true }
      }
    ],
    required: true
  },
  answer: {
    type: [
      {
        value: { type: String, required: true },
        prefill: { type: Boolean, required: true }
      }
    ],
    required: true
  },
  redHerrings: { type: [String], required: true },
  sources: {
    type: {
      word: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      },
      text: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      }
    },
    required: true
  }
})

const Model = mongoose.model("Question", questionSchema)
module.exports = Model