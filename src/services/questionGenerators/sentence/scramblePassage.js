const _ = require("underscore")

const question = passage => {
  if (passage.tagged.length < 2) {
    return
  }

  let params = {}

  params.prompt = []
  params.redHerrings = []

  params.answer = passage.tagged.map(sentence => ({
    prefill: false,
    value: sentence.map(word => word.value).join(" ")
  }))

  return params
}

module.exports = doc => doc.passages.map(question)
