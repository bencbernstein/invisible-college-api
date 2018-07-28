const mongoose = require("mongoose")
const Schema = mongoose.Schema

var imageSchema = new Schema({
  caption: String,
  location: String,
  buf: { type: Buffer, required: true },
  words: { type: [Schema.Types.ObjectId], required: true, default: [] }
})

const Model = mongoose.model("Image", imageSchema)
module.exports = Model
