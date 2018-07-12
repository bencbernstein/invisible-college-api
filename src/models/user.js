const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const Model = mongoose.model("User", userSchema)
module.exports = Model
