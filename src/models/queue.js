const mongoose = require("mongoose")
const Schema = mongoose.Schema

var queueSchema = new Schema({
  entity: { type: String, enum: ["image", "word", "passage"] },
  type: { type: String, enum: ["filter", "enrich"] },
  items: { type: [{ id: String, matches: [String] }] }
})

const Model = mongoose.model("Queue", queueSchema)
module.exports = Model
