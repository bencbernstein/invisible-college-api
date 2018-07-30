const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: {
    type: [
      {
        textId: { type: Schema.Types.ObjectId, required: true },
        sentenceIdx: { type: Number, required: true, min: 0 }
      }
    ],
    default: []
  }
})

const Model = mongoose.model("User", userSchema)
module.exports = Model
