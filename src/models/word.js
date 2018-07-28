const mongoose = require("mongoose")
const Schema = mongoose.Schema

var wordSchema = new Schema({
  value: { type: String, required: true },
  isDecomposable: { type: Boolean, required: true, default: false },
  synonyms: { type: [Schema.Types.ObjectId], default: [] },
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

const Model = mongoose.model("Word", wordSchema)
module.exports = Model
