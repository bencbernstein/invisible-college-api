const { extend } = require("underscore")

const wordToDef = (doc, redHerringDocs, sources, daisyChain) => {
  const { value, definition } = doc

  if (definition.length === 0) {
    return []
  }

  const questions = []
  const params = {}
  const reverseParams = {}

  redHerringDocs = redHerringDocs.slice(0, 5)
  params.TYPE = "Word to Definition"
  params.prompt = doc.highlightedDefinition()
  params.answer = [{ value, prefill: false }]
  params.redHerrings = redHerringDocs.map(d => d.value)
  questions.push(params)

  redHerringDocs = redHerringDocs.slice(0, 3)
  reverseParams.TYPE = "Word to Definition (reverse)"
  reverseParams.prompt = [{ value, highlight: false }]
  reverseParams.answer = [{ value: doc.simpleDefinition(), prefill: false }]
  reverseParams.redHerrings = redHerringDocs.map(d => d.simpleDefinition())
  questions.push(reverseParams)

  return questions.map(q => extend(q, { sources, daisyChain, difficulty: 1 }))
}

module.exports = wordToDef
