// TODO: - fix, highlight part of word and match root with definition

/*const _ = require("underscore")

module.exports = (doc, redHerringDocs) => {
  if (!doc.isDecomposable) {
    return []
  }

  console.log(doc)

  const { value } = doc.components[_.sample(doc.rootIndices())]

  const answer = [{ value, prefill: false }]

  const prompt = [{ value: "hi", highlight: false }]

  let redHerrings = _.without(
    _.uniq(_.flatten(redHerringDocs.map(doc => doc.rootValues()))),
    value
  )
  redHerrings = _.sample(redHerrings, 5)

  return [{ prompt, answer, redHerrings }]
}
*/
