const { sample, without, flatten, contains, extend } = require("underscore")

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map(c => c.toUpperCase())

const question = (doc, redHerringDocs, oneRoot, allChars, TYPE) => {
  const prompt = doc.highlightedDefinition()

  const indices = doc.rootIndices()
  const prefillIndices = oneRoot ? [sample(indices)] : indices

  const answer = allChars
    ? doc.value
        .toUpperCase()
        .split("")
        .map(value => ({ prefill: false, value }))
    : flatten(
        doc.components.map((c, idx) =>
          c.value
            .toUpperCase()
            .split("")
            .map(value => ({
              prefill: !contains(prefillIndices, idx),
              value
            }))
        )
      )

  const answerValues = answer.filter(a => !a.prefill).map(a => a.value)

  const redHerrings = sample(
    without(ALPHABET, ...[answerValues]),
    12 - answerValues.length
  )

  return { TYPE, prompt, answer, redHerrings }
}

module.exports = (doc, redHerringDocs, sources, difficulty) => {
  const questions = []

  if (doc.value.length < 10) {
    questions.push(question(doc, redHerringDocs, false, true, "Word to Chars"))
  }

  if (doc.isDecomposable) {
    questions.push(
      question(doc, redHerringDocs, false, false, "Word to Chars (roots)")
    )

    if (doc.hasMultipleRoots()) {
      questions.push(
        question(doc, redHerringDocs, true, false, "Word to Chars (one root)")
      )
    }
  }

  return questions.map(q => extend(q, { sources, difficulty }))
}
