const _ = require("underscore")

const question = passage =>
  passage.tagged.map((sentence, idx) => {
    if (sentence.length > 9) {
      return
    }

    let params = {}

    params.answer = _.flatten(
      passage.tagged.map((sentence, idx2) => {
        const prefill = idx !== idx2
        if (prefill) {
          const value = sentence.map(word => word.value).join(" ")
          return { prefill, value }
        } else {
          return sentence.map(word => ({ prefill, value: word.value }))
        }
      })
    )

    return params
  })

module.exports = doc => doc.passages.map(question)
