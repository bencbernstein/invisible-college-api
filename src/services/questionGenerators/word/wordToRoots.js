const _ = require("underscore")

const question = (doc, redHerringDocs, oneRoot, highlight) => {
  const prompt = highlight
    ? doc.highlightedDefinition()
    : doc.unHighlightedDefinition()

  const rootIndices = doc.rootIndices()
  const prefillIndices = oneRoot ? [_.sample(rootIndices)] : rootIndices

  const answer = doc.components.map((c, idx) => ({
    prefill: !_.contains(prefillIndices, idx),
    value: c.value
  }))
  const answerValues = answer.filter(a => !a.prefill).map(a => a.value)

  let redHerrings = _.without(
    _.uniq(_.flatten(redHerringDocs.map(doc => doc.rootValues()))),
    ...answerValues
  )
  redHerrings = _.sample(redHerrings, 6 - answerValues.length)

  return { prompt, answer, redHerrings }
}

module.exports = (doc, redHerringDocs) => {
  if (!doc.isDecomposable) {
    return []
  }

  const questions = [
    question(doc, redHerringDocs, false, true),
    question(doc, redHerringDocs, false, false)
  ]

  if (doc.hasMultipleRoots()) {
    questions.concat(question(doc, redHerringDocs, true, true))
  }

  return questions
}
