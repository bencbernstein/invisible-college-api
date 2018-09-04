const mongoose = require("mongoose")
const Schema = mongoose.Schema

const passageSequenceSchema = new Schema({
  name: { type: String, required: true },
  count: { type: Number, min: 0, required: true, default: 0 },
  passages: { type: [Schema.Types.ObjectId], required: true, default: [] }
})

const Model = mongoose.model("PassageSequence", passageSequenceSchema)
module.exports = Model
