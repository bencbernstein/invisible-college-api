const _ = require("underscore")
const chai = require("chai")

const correctPrompt = obj =>
  Array.isArray(obj.prompt) &&
  _.every(obj.prompt, p => _.has(p, "value") || _.has(p, "isSentenceConnector"))

const correctAnswer = obj =>
  Array.isArray(obj.answer) &&
  _.every(obj.answer, p => _.has(p, "prefill") && _.has(p, "value"))

const correctRedHerrings = obj =>
  Array.isArray(obj.redHerrings) && _.every(obj.redHerrings, _.isString)

exports.assertCorrectProperties = questions =>
  questions.forEach((q, idx) => {
    q.prompt &&
      chai.assert(
        correctPrompt(q),
        `incorrectly formatted prompt, Q no. ${idx + 1}`
      )

    chai.assert(
      correctAnswer(q),
      `incorrectly formatted answer, Q no. ${idx + 1}`
    )

    q.redHerrings &&
      chai.assert(
        correctRedHerrings(q),
        `incorrectly formatted red herrings, Q no. ${idx + 1}`
      )
  })
