const mongoose = require("mongoose")
const Schema = mongoose.Schema

var wordSchema = new Schema({
  value: { type: String, required: true },
  isDecomposable: { type: Boolean, required: true, default: false },
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
    ],
    required: true
  },
  obscurity: Number
})

const Model = mongoose.model("Word", wordSchema)
module.exports = Model
