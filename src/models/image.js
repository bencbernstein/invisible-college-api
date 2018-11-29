const mongoose = require("mongoose")
const Schema = mongoose.Schema

var imageSchema = new Schema({
  caption: String,
  location: String,
  url: String,
  buf: { type: Buffer, required: true },
  words: { type: [Schema.Types.ObjectId], required: true, default: [] }
})

imageSchema.methods.base64 = function() {
  return this.buf.toString("base64")
}

const Model = mongoose.model("Image", imageSchema)
module.exports = Model
