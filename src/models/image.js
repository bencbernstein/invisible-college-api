const mongoose = require("mongoose")
const Schema = mongoose.Schema

var imageSchema = new Schema({
  caption: String,
  location: String,
  url: String,
  words: { type: [Schema.Types.ObjectId], required: true, default: [] }
})

const Model = mongoose.model("Image", imageSchema)
module.exports = Model
