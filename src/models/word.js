const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ImageModel = require("./image")
const categories = require("../lib/categories")

var wordSchema = new Schema({
  value: { type: String, required: true },
  isDecomposable: { type: Boolean, required: true, default: false },
  synonyms: { type: [String], default: [] },
  categories: {
    type: [
      {
        type: String,
        enum: categories
      }
    ]
  },
  components: {
    type: [
      {
        isRoot: { type: Boolean, required: true },
        value: { type: String, required: true }
      }
    ]
  },
  definition: {
    type: [
      {
        highlight: { type: Boolean, required: true },
        value: { type: String, required: true }
      }
    ]
  },
  tags: {
    type: [
      {
        value: { type: String, required: true },
        id: { type: Schema.Types.ObjectId },
        choiceSetIds: { type: [Schema.Types.ObjectId], default: [] }
      }
    ],
    default: []
  },
  unverified: {
    type: {
      tags: [String],
      synonyms: [String],
      definition: String
    },
    default: {}
  },
  obscurity: Number,
  images: { type: [Schema.Types.ObjectId], required: true, default: [] }
})

wordSchema.methods.simpleDefinition = function () {
  return this.definition.map(d => d.value).join("")
}

wordSchema.methods.highlightedDefinition = function () {
  return this.definition.map(d => ({ value: d.value, highlight: d.highlight }))
}

wordSchema.pre("save", async function (next) {
  const images = await ImageModel.find({ words: this.value })
  if (images.length) {
    this.images = images.map(i => i._id)
  }
  next()
})

const Model = mongoose.model("Word", wordSchema)
module.exports = Model
