const mongoose = require("mongoose")
const Schema = mongoose.Schema

var imageSchema = new Schema({
  caption: String,
  location: String,
  buf: { type: Buffer, required: true },
  words: { type: [String], required: true, default: [] }
})

imageSchema.methods.base64 = function() {
  return "data:image/jpg;base64," + this.buf.toString("base64")
}

const Model = mongoose.model("Image", imageSchema)
module.exports = Model
