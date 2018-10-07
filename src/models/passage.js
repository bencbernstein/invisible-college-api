const mongoose = require("mongoose")
const Schema = mongoose.Schema

const STATUSES = ["unfiltered", "accepted", "rejected", "enriched"]

var passageSchema = new Schema({
  source: String,
  title: String,
  matchIdx: { type: Number, required: true },
  value: { type: String, required: true },
  status: {
    type: String,
    enum: STATUSES
  },
  filteredSentences: { type: [Number], required: true, default: [] },
  tagged: {
    type: [
      {
        isSentenceConnector: Boolean,
        value: String,
        tag: String,
        isFocusWord: Boolean,
        isPunctuation: Boolean,
        isConnector: Boolean,
        isUnfocused: Boolean,
        wordId: Schema.Types.ObjectId,
        choiceSetId: Schema.Types.ObjectId
      }
    ],
    required: true
  }
})

const Model = mongoose.model("Passage", passageSchema)
module.exports = Model
