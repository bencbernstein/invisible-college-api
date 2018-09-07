const _ = require("underscore")
const TextModel = require("../../../models/text")

const ATTRS = ["date", "source", "name", "author"]

const question = async (passage, attr, passages) => {
  const value = passage[attr]

  if (!value) {
    return
  }

  const prompt = passage.tagged.map(
    word => (word.isSentenceConnector ? word : { value: word.value })
  )
  const answer = [{ prefill: false, value }]

  const redHerrings = _.uniq(
    passages.map(p => p[attr]).filter(a => a && a !== value)
  ).slice(0, 5)

  const TYPE = "PASSAGE_TO_" + attr.toUpperCase()

  return { prompt, answer, redHerrings, TYPE }
}

module.exports = async (passage, passages) =>
  Promise.all(ATTRS.map(a => question(passage, a, passages)))
