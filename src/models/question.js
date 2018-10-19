const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categories = require("../lib/categories")

const questionSchema = new Schema({
  TYPE: { type: String, required: true },
  categories: {
    type: [String]
  },
  difficulty: { type: Number, required: true, min: 1 },
  prompt: {
    type: [
      {
        value: String,
        isSentenceConnector: Boolean,
        highlight: Boolean,
        hide: Boolean
      }
    ]
  },
  answer: {
    type: [
      {
        value: String,
        prefill: Boolean,
        isSentenceConnector: Boolean
      }
    ]
  },
  interactive: {
    type: [
      {
        value: String,
        correct: Boolean
      }
    ]
  },
  answerCount: { type: Number, min: 1 },
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
    }
  }
})

const Model = mongoose.model("Question", questionSchema)
module.exports = Model
