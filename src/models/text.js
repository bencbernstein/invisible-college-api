const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categories = require("../lib/categories")

var textSchema = new Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  tokenized: { type: String, required: true },
  isPreFiltered: { type: Boolean, required: true, default: false },
  categories: {
    type: [
      {
        type: String,
        enum: categories
      }
    ]
  },
  passages: {
    type: [
      {
        startIdx: { type: Number, required: true, min: 0 },
        endIdx: { type: Number, required: true },
        value: { type: String }, // TODO: - add required
        found: { type: [String], required: true, default: [] },
        isEnriched: { type: Boolean, required: true, default: false },
        tagged: {
          type: [
            {
              value: { type: String }, // TODO: - add required
              tag: { type: String, required: true },
              isFocusWord: { type: Boolean, required: true, default: false },
              isPunctuation: { type: Boolean, required: true, default: false }
            }
          ],
          required: true
        }
      }
    ],
    default: []
  },
  passagesCount: { type: Number, required: true, min: 0, default: 0 },
  unenrichedPassagesCount: { type: Number, required: true, min: 0, default: 0 }
})

textSchema.pre("save", function(next) {
  console.log("trigger")
  this.passagesCount = this.passages.length
  this.unenrichedPassagesCount = this.passages.filter(p => !p.isEnriched).length
  next()
})

const Model = mongoose.model("Text", textSchema)
module.exports = Model
