const _ = require("underscore")
const TextModel = require("../../../models/text")

const ATTRS = ["date", "source", "name", "author"]

const question = async (passage, attr, attrs) => {
  const value = attrs[attr]

  if (!value) {
    return
  }

  const params = {}

  params.prompt = _.flatten(passage.tagged).map(p => ({
    value: p.value,
    highlight: false
  }))

  params.answer = [{ prefill: false, value }]

  params.redHerrings = await TextModel.redHerrings(attr, value)
  params.TYPE = "PASSAGE_TO_" + attr.toUpperCase()

  return params
}

module.exports = async doc => {
  const attrs = _.pick(doc, ATTRS)

  const promises = _.flatten(
    doc.passages.map(p => ATTRS.map(a => [p, a])),
    1
  ).map(async params => await question(params[0], params[1], attrs))

  return Promise.all(promises)
}
