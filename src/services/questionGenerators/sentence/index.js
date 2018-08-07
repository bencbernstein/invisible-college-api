const _ = require("underscore")

const sentenceToPoS = require("./sentenceToPoS")
const sentenceToTruth = require("./sentenceToTruth")

const TextModel = require("../../../models/text")

const TYPES = {
  SENTENCE_TO_POS: sentenceToPoS,
  SENTENCE_TO_TRUTH: sentenceToTruth
}

const sentenceTokenize = tagged => {
  let arr = []
  let next = true

  while (tagged.length) {
    const tag = tagged.shift()
    if (next) {
      arr.push([tag])
      next = false
    } else {
      arr[arr.length - 1] = arr[arr.length - 1].concat(tag)
    }
    if (tag.tag === ".") {
      next = true
    }
  }

  return arr
}

module.exports = async (id, type, reverse = false) => {
  const doc = await TextModel.findById(id)

  const sentences = _.flatten(
    doc.passages.map(p => p.tagged).map(sentenceTokenize),
    true
  )

  const params = [sentences, reverse]

  const generate = async TYPE =>
    _
      .compact(_.flatten(await TYPES[TYPE](...params)))
      .map(q => _.extend({}, q, { TYPE }))

  let questions

  if (type) {
    questions = await generate(type)
  } else {
    questions = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(questions))
  }

  const text = { id, value: doc.name }
  questions.forEach(q => (q.sources = { text }))

  return questions
}
