const _ = require("underscore")

const wordToDef = (doc, redHerringDocs, reverse) => {
  const questions = []

  if (reverse === true || reverse === undefined) {
    let params = {}
    params.prompt = doc.highlightedDefinition()
    params.answer = [{ value: doc.value, prefill: false }]
    params.redHerrings = redHerringDocs.map(d => d.value)
    questions.push(params)
  }

  if (reverse === false || reverse === undefined) {
    let params = {}
    params.prompt = [{ value: doc.value, highlight: false }]
    params.answer = [{ value: doc.simpleDefinition(), prefill: false }]
    params.redHerrings = redHerringDocs.map(d => d.simpleDefinition())
    questions.push(params)
  }

  return questions
}

module.exports = wordToDef