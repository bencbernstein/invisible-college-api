const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { partition, sample } = require("lodash")

const ImageModel = require("./image")
const PassageModel = require("./passage")

const { qForExp } = require("../lib/helpers")

const questionSchema = new Schema({
  TYPE: { type: String, required: true },
  passageOrWord: { type: String, enum: ["passage", "word"], required: true },
  passageDifficulty: { type: Number, required: true, default: 1, min: 1 },
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
        source: {
          type: {
            model: {
              type: String,
              enum: ["word", "passage", "question", "image"],
              required: true
            },
            id: { type: Schema.Types.ObjectId },
            difficulty: { type: Number, min: 1, max: 10 }
          },

          required: true
        },
        type: {
          type: String,
          enum: ["sharesRoot", "imageOnCorrect", "passageOnCorrect"]
        },
        isRequired: { type: Boolean, default: false }
      }
    ]
  },
  sources: {
    type: {
      word: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      },
      text: {
        type: {
          id: { type: Schema.Types.ObjectId, required: true },
          value: { type: String, required: true }
        }
      }
    }
  }
})

questionSchema.methods.imageOnCorrect = async function() {
  const images = this.daisyChain.filter(d => d.type === "imageOnCorrect")
  if (images.length) {
    const id = sample(images).source.id
    const image = await ImageModel.findById(id)
    if (image) {
      const base64 = image.base64()
      return { base64 }
    }
  }
}

questionSchema.methods.passageOnCorrect = async function() {
  const passages = this.daisyChain.filter(d => d.type === "passageOnCorrect")
  if (passages.length === 0) {
    return
  }
  passages.sort((a, b) => a.source.difficulty - b.source.difficulty)
  const id = passages[0].source.id
  const passage = await PassageModel.findById(id)
  const value = passage.rawValue()
  return { id, title: passage.title, value }
}

questionSchema.statics.createDaisyChain = async function(question, user) {
  const questions = [question]

  question.daisyChain.sort((a, b) => a.source.difficulty - b.source.difficulty)
  const [seen, unseen] = partition(
    question.daisyChain.filter(d => d.type === "sharesRoot"),
    d => user.words.map(w => String(w.id)).indexOf(String(d.source.id)) > -1
  )

  const ids = []
  if (seen.length) {
    ids.push(sample(seen).source.id)
  }
  if (unseen.length > 0 && Math.random() > 0.85) {
    ids.push(sample(unseen).source.id)
  }
  const pool = await this.find({ "sources.word.id": { $in: ids } })
  questions.push(...qForExp(pool, user, ids))
  return questions
}

const Model = mongoose.model("Question", questionSchema)
module.exports = Model
