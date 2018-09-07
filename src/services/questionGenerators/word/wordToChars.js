const _ = require("underscore")

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map(c => c.toUpperCase())

const question = (doc, redHerringDocs, type) => {
  const prompt = doc.highlightedDefinition()

  const indices = doc.rootIndices()
  const prefillIndices = type === "oneRoot" ? [_.sample(indices)] : indices

  const answer =
    type === "allChars"
      ? doc.value
          .toUpperCase()
          .split("")
          .map(value => ({ prefill: false, value }))
      : _.flatten(
          doc.components.map((c, idx) =>
            c.value
              .toUpperCase()
              .split("")
              .map(value => ({
                prefill: !_.contains(prefillIndices, idx),
                value
              }))
          )
        )

  const answerValues = answer.filter(a => !a.prefill).map(a => a.value)

  const redHerrings = _.sample(
    _.without(ALPHABET, ...[answerValues]),
    12 - answerValues.length
  )

  return { prompt, answer, redHerrings }
}

module.exports = (doc, redHerringDocs) => {
  const questions = []

  if (doc.value.length < 10) {
    questions.push(question(doc, redHerringDocs, "allChars"))
  }

  if (doc.isDecomposable) {
    questions.push(question(doc, redHerringDocs, "oneRoot"))
  }

  if (doc.hasMultipleRoots()) {
    questions.push(question(doc, redHerringDocs, "allRoots"))
  }

  return questions
}
