const _ = require("underscore")

module.exports = (doc, redHerringDocs) =>
  doc.tags.map(tag => {
    const params = {}

    params.prompt = [{ value: doc.value, highlight: false }]
    params.answer = [{ value: tag.value, prefill: false }]
    params.redHerrings = _.sample(
      _.without(
        _.flatten(redHerringDocs.map(d => d.tags.map(t => t.value))),
        ...doc.tags.map(t => t.value)
      ),
      5
    )

    return params
  })
