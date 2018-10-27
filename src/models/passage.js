const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { find, flatten } = require("underscore")

const STATUSES = ["unfiltered", "accepted", "rejected", "enriched"]

const isPunc = require("../lib/helpers")

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

const makeQuestionFor = (word, isFocusWord = true) =>
  word.isFocusWord || ((word.wordId || word.choiceSetId) && !word.isUnfocused)

const toSentences = tags => {
  const sentences = [[]]
  let senIdx = 0
  tags.forEach(tag => {
    if (tag.isSentenceConnector) {
      senIdx += 1
      sentences.push([])
    } else {
      sentences[senIdx].push(tag)
    }
  })
  return sentences
}

passageSchema.methods.questionData = function() {
  const id = this._id

  const tagged = flatten(
    toSentences(this.tagged).filter((s, idx) =>
      this.filteredSentences.includes(idx)
    )
  )

  const focusWordIndices = tagged
    .map((word, i) => (makeQuestionFor(word) ? i : -1))
    .filter(i => i > -1)

  return { tagged, focusWordIndices, id }
}

passageSchema.methods.rawValue = function() {
  return flatten(
    this.toSentences()
      .map(({ value }) => value)
      .filter(v => v)
      .reduce((prev, curr) => [prev, isPunc(curr) ? "" : " ", curr])
  ).join("")
}

exports.track = (date, idx) => console.log(`${idx}: ${new Date() - date}`)

const Model = mongoose.model("Passage", passageSchema)
module.exports = Model
