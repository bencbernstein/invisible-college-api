const mongoose = require("mongoose")

const question = {
  _id: mongoose.Types.ObjectId(),
  TYPE: "WORD_TO_DEF",
  prompt: [
    {
      value: "lion",
      highlight: false
    }
  ],
  answer: [
    {
      value: "a large African cat",
      prefill: false
    }
  ],
  difficulty: 1,
  redHerrings: [
    "a  cloud, often used of large groups of stars",
    "a cell that joins with or marries another cell during fertilization",
    "generous, having a large soul",
    "a recording of the activity of the heart",
    "a medical condition in which a hard horn-like substance grows on the skin"
  ],
  sources: { word: { id: mongoose.Types.ObjectId(), value: "lion" } }
}
const questions = [
  {
    _id: mongoose.Types.ObjectId(),
    TYPE: "WORD_TO_ROOTS",
    prompt: [
      {
        value: "a large African cat",
        highlight: false
      }
    ],
    answer: [],
    difficulty: 2,
    redHerrings: ["ker", "gram", "cardi", "anim", "gam", "magn"],
    sources: { word: { id: mongoose.Types.ObjectId(), value: "lion" } }
  },
  {
    _id: mongoose.Types.ObjectId(),
    TYPE: "WORD_TO_TAG",
    prompt: [
      {
        value: "lion",
        highlight: false
      }
    ],
    answer: [
      {
        value: "Africa",
        prefill: false
      }
    ],
    difficulty: 2,
    redHerrings: ["recording", "hospital", "lion", "heart"],
    sources: { word: { id: mongoose.Types.ObjectId(), value: "lion" } }
  }
]

module.exports = {
  mock: question,
  mocks: questions.concat(question)
}
