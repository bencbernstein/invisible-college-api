const mongoose = require("mongoose")
const Schema = mongoose.Schema

var curriculumSchema = new Schema({
  name: { type: String, required: true },
  createdOn: String
})

const Model = mongoose.model("Curriculum", curriculumSchema)
module.exports = Model
