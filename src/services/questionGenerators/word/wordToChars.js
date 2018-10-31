const { sample, without, flatten, contains, extend } = require("underscore")

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map(c => c.toUpperCase())

const question = (doc, redHerringDocs, oneRoot, allChars, TYPE, difficulty) => {
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

  return { TYPE, prompt, answer, redHerrings, difficulty }
}

module.exports = (doc, redHerringDocs, sources, daisyChain) => {
  const questions = []
  let name

  if (doc.value.length < 10) {
    name = "Word to Chars"
    questions.push(question(doc, redHerringDocs, false, true, name, 7))
  }

  if (doc.isDecomposable) {
    name = "Word to Chars (roots)"
    questions.push(question(doc, redHerringDocs, false, false, name, 6))

    if (doc.hasMultipleRoots()) {
      name = "Word to Chars (one root)"
      questions.push(question(doc, redHerringDocs, true, false, name, 5))
    }
  }

  return questions.map(q => extend(q, { sources, daisyChain }))
}
