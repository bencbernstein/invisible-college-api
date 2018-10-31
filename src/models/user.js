const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema

const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  questionsAnswered: { type: Number, required: true, default: 0 },
  wordsLearned: { type: Number, required: true, default: 0 },
  passagesRead: { type: Number, required: true, default: 0 },
  rank: { type: Number, min: 1 },
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
  },
  words: {
    type: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        value: { type: String, required: true },
        seenCount: { type: Number, required: true, min: 1 },
        correctCount: { type: Number, required: true, min: 0 },
        experience: { type: Number, required: true, min: 0 }
      }
    ]
  },
  passages: {
    type: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        experience: { type: Number, required: true, min: 0, default: 0 }
      }
    ]
  }
})

userSchema.pre("save", function(next) {
  const user = this

  if (!user.isModified("password")) {
    return next()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }

      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.initials = function() {
  return (
    this.firstName.charAt(0).toUpperCase() +
    this.lastName.charAt(0).toUpperCase()
  )
}

const Model = mongoose.model("User", userSchema)
module.exports = Model
