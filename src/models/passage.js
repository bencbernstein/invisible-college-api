const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { find } = require("underscore")

const STATUSES = ["unfiltered", "accepted", "rejected", "enriched"]

const SUB_CONJ = find(
  require("../lib/connectors"),
  c => c.type === "subordinating conjunction"
).elements

var passageSchema = new Schema({
  source: String,
  title: String,
  matchIdx: { type: Number, required: true },
  value: { type: String, required: true },
  factoidOnCorrect: { type: Boolean, required: true, default: false },
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

passageSchema.methods.connectorCount = function() {
  return this.tagged.filter(t => SUB_CONJ.indexOf(t.value) > -1).length
}

const Model = mongoose.model("Passage", passageSchema)
module.exports = Model
