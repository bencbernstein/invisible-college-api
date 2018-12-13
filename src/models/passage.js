const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { find, flatten, uniq, shuffle, sample } = require("underscore")

const STATUSES = ["unfiltered", "accepted", "rejected", "enriched"]

const { isPunc } = require("../lib/helpers")

const SUB_CONJ = find(
  require("../lib/connectors"),
  c => c.type === "subordinating conjunction"
).elements

var passageSchema = new Schema({
  source: String,
  title: String,
  factoidOnCorrect: { type: Boolean, required: true, default: false },
  difficulty: { type: Number, required: true, default: 1, min: 1, max: 100 },
  enriched: { type: Boolean, required: true, default: false },
  curriculumId: { type: Schema.Types.ObjectId, required: true },
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

passageSchema.methods.wordIds = function() {
  const { tagged } = this.questionData()
  return uniq(tagged.map(({ wordId }) => wordId).map(id => id))
}

passageSchema.methods.wordCount = function() {
  const { tagged } = this.questionData()
  return tagged.length
}

const makeQuestionFor = (word, isFocusWord = true) =>
  word.isFocusWord || ((word.wordId || word.choiceSetId) && !word.isUnfocused)

const toSentences = tags => {}

passageSchema.methods.filtered = function() {
  const sentences = [[]]
  let senIdx = 0
  this.tagged.forEach(tag => {
    if (tag.isSentenceConnector) {
      senIdx += 1
      sentences.push([])
    } else {
      sentences[senIdx].push(tag)
    }
  })
  return flatten(
    sentences.filter((s, idx) => this.filteredSentences.includes(idx))
  )
}

passageSchema.methods.questionData = function() {
  const id = this._id

  const tagged = this.filtered()
  const focusWordIndices = tagged
    .map((word, i) => (makeQuestionFor(word) ? i : -1))
    .filter(i => i > -1)

  return { tagged, focusWordIndices, id }
}

passageSchema.methods.rawValue = function() {
  return this.filtered()
    .map(({ value }) => (isPunc(value) ? value : ` ${value}`))
    .join("")
}

passageSchema.statics.sourcesForNextUnseen = async function(user) {
  const userPassageIds = user.passages.map(p => p.id)
  const userWordIds = user.words.map(w => w.id)

  const passage = await this.findOne({
    _id: { $nin: userPassageIds },
    status: "enriched",
    filteredWords: { $not: { $size: 0 } }
  }).sort("difficulty")

  const wordIds = shuffle(passage.filteredWords.concat(sample(userWordIds, 2)))

  return { id: passage._id, wordIds }
}

exports.track = (date, idx) => console.log(`${idx}: ${new Date() - date}`)

const Model = mongoose.model("Passage", passageSchema)
module.exports = Model
