const _ = require("underscore")

module.exports = (doc, redHerringDocs) =>
  doc.synonyms.map(synonym => {
    const params = {}

    params.prompt = [{ value: doc.value, highlight: false }]
    params.answer = [{ value: synonym, prefill: false }]
    params.redHerrings = _.sample(
      _.without(redHerringDocs.map(d => d.value), ...doc.synonyms),
      5
    )

    return params
  })
