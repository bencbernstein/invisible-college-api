const _ = require("underscore")

module.exports = (doc, redHerringDocs) => {
  if (!doc.isDecomposable) {
    return []
  }

  const prompt = doc.highlightedDefinition()

  const answerRoots = doc.components.filter(c => c.isRoot).map(c => c.value)

  const answer = doc.components.map(c => ({
    prefill: !c.isRoot,
    value: c.value
  }))

  const roots = _.without(
    _
      .flatten(
        redHerringDocs.filter(d => d.isDecomposable).map(d => d.components)
      )
      .filter(c => c.isRoot),
    answerRoots
  )

  const redHerrings = _
    .sample(roots, 6 - answerRoots.length)
    .map(root => root.value)

  return [
    {
      prompt,
      answer,
      redHerrings
    }
  ]
}
