const _ = require("underscore")

const { toSentences } = require("../../../lib/helpers")

module.exports = passage => {
  const sentences = toSentences(passage)

  if (sentences.length < 3) {
    return
  }

  const questions = []

  _.range(1, sentences.length - 1).forEach(idx => {
    const answer = _.flatten(
      sentences.map((sen, idx2) => {
        const prefill = idx !== idx2
        if (!prefill) {
          return sen.map(word => ({ value: word.value, prefill }))
        }
        const value = sen.map(word => word.value).join(" ")
        return { value, prefill }
      })
    )

    questions.push({ answer })
  })

  return questions
}
