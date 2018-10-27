const {
  sample,
  contains,
  extend,
  without,
  uniq,
  flatten
} = require("underscore")

const question = (doc, redHerringDocs, oneRoot, highlight, TYPE) => {
  const prompt = highlight
    ? doc.highlightedDefinition()
    : doc.unHighlightedDefinition()

  const rootIndices = doc.rootIndices()
  const prefillIndices = oneRoot ? [sample(rootIndices)] : rootIndices

  const answer = doc.components.map((c, idx) => ({
    prefill: !contains(prefillIndices, idx),
    value: c.value
  }))
  const answerValues = answer.filter(a => !a.prefill).map(a => a.value)

  let redHerrings = without(
    uniq(flatten(redHerringDocs.map(doc => doc.rootValues()))),
    ...answerValues
  )
  redHerrings = sample(redHerrings, 6 - answerValues.length)

  return { TYPE, prompt, answer, redHerrings }
}

module.exports = (doc, redHerringDocs, sources, difficulty) => {
  if (!doc.isDecomposable) {
    return []
  }

  const questions = [
    question(doc, redHerringDocs, false, true, "Word to Roots"),
    question(doc, redHerringDocs, false, false, "Word to Roots (no highlight)")
  ]

  if (doc.hasMultipleRoots()) {
    const TYPE = "Word to Roots (no highlight | one root)"
    questions.concat(question(doc, redHerringDocs, true, true, TYPE))
  }

  return questions.map(q => extend(q, { sources, difficulty }))
}
