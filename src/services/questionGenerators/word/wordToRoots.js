const {
  sample,
  contains,
  extend,
  without,
  uniq,
  flatten
} = require("underscore")

const question = (
  doc,
  redHerringDocs,
  oneRoot,
  highlight,
  TYPE,
  difficulty
) => {
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

  return { TYPE, prompt, answer, redHerrings, difficulty }
}

module.exports = (doc, redHerringDocs, sources, daisyChain) => {
  if (!doc.isDecomposable) return []

  const difficulty = doc.hasMultipleRoots() ? 2 : 1

  const questions = [
    question(doc, redHerringDocs, false, true, "Word to Roots", difficulty),
    question(
      doc,
      redHerringDocs,
      false,
      false,
      "Word to Roots (no highlight)",
      difficulty + 1
    )
  ]

  if (doc.hasMultipleRoots()) {
    const TYPE = "Word to Roots (no highlight | one root)"
    questions.concat(
      question(doc, redHerringDocs, true, true, TYPE, difficulty)
    )
  }

  return questions.map(q => extend(q, { sources, daisyChain, difficulty }))
}
