const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { shuffle, sampleSize } = require("lodash")

const UserModel = require("./user")

const { isPunc } = require("../lib/helpers")

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
        pos: String,
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

const makeQuestionFor = (word, isFocusWord = true) =>
  word.isFocusWord || ((word.wordId || word.choiceSetId) && !word.isUnfocused)

passageSchema.methods.focusWordIndices = function() {
  return this.tagged
    .map((word, i) => (makeQuestionFor(word) ? i : -1))
    .filter(i => i > -1)
}

passageSchema.methods.rawValue = function() {
  return this.tagged
    .map(({ value }) => (isPunc(value) ? value : ` ${value}`))
    .join("")
}

passageSchema.statics.sourcesForNextUnseen = async function(
  user,
  curriculumId
) {
  const userPassageIds = user.passages.map(p => p.id)
  const userWordIds = user.words.map(w => w.id)
  const userWordsSample =
    user.words.length > 2 ? sampleSize(userWordIds, 2) : []

  const passage = await this.findOne({
    _id: { $nin: userPassageIds },
    enriched: true,
    curriculumId
  }).sort("difficulty")

  await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { $push: { passages: { id: passage._id } } }
  )

  const wordIds = passage.tagged
    .map(({ wordId }) => wordId)
    .filter(id => id)
    .concat(...userWordsSample)

  return { id: passage._id, wordIds }
}

const Model = mongoose.model("Passage", passageSchema)
module.exports = Model
