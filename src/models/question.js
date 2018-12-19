const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { partition, sample } = require("lodash")

const ImageModel = require("./image")
const PassageModel = require("./passage")

const { qForExp } = require("../lib/helpers")

const questionSchema = new Schema({
  TYPE: { type: String, required: true },
  passageOrWord: { type: String, enum: ["passage", "word"], required: true },
  difficulty: { type: Number, required: true, default: 1, min: 1 },
  prompt: {
    type: [
      {
        value: String,
        isSentenceConnector: Boolean,
        highlight: Boolean,
        hide: Boolean
      }
    ]
  },
  answer: {
    type: [
      {
        value: String,
        prefill: Boolean,
        isSentenceConnector: Boolean
      }
    ]
  },
  interactive: {
    type: [
      {
        value: String,
        correct: Boolean
      }
    ]
  },
  answerCount: { type: Number, min: 1 },
  redHerrings: { type: [String], required: true },
  experience: Number,
  daisyChain: {
    type: [
      {
        type: {
          type: String,
          enum: ["word", "passage", "question", "image"],
          required: true
        },
        id: { type: Schema.Types.ObjectId, required: true },
        difficulty: {
          type: Number,
          min: 1,
          max: 10,
          required: true,
          default: 1
        },
        isRequired: { type: Boolean, default: false }
      }
    ],
    required: true,
    default: []
  },
  sources: {
    type: {
      word: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      },
      passage: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      }
    }
  },
  curriculumId: { type: Schema.Types.ObjectId }
})

questionSchema.methods.imageOnCorrect = async function() {
  const images = this.daisyChain.filter(d => d.type === "image")
  if (images.length === 0) return
  const id = sample(images).id
  const image = await ImageModel.findById(id)
  return { url: image.url }
}

questionSchema.methods.passageOnCorrect = async function() {
  const passages = this.daisyChain.filter(d => d.type === "passage")
  if (passages.length === 0) return
  passages.sort((a, b) => a.difficulty - b.difficulty)
  const id = passages[0].id
  const passage = await PassageModel.findById(id)
  const value = passage.rawValue()
  return { id, title: passage.title, value }
}

questionSchema.statics.createDaisyChain = async function(question, user) {
  const questions = [question]
  const userWordIds = user.words.map(w => String(w.id))

  question.daisyChain.sort((a, b) => a.difficulty - b.difficulty)

  const [seen, unseen] = partition(
    question.daisyChain.filter(d => d.type === "word"),
    d => userWordIds.indexOf(String(d.id)) > -1
  )

  const ids = []
  if (seen.length) {
    ids.push(sample(seen).id)
  }
  if (unseen.length > 0) {
    // TODO: - uncomment && Math.random() > 0.85) {
    ids.push(sample(unseen).id)
  }

  const pool = await this.find({ "sources.word.id": { $in: ids } })
  questions.push(...qForExp(pool, user, ids))
  return questions
}

const Model = mongoose.model("Question", questionSchema)
module.exports = Model
