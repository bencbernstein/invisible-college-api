const _ = require("underscore")

const locateConnectors = passage =>
  _.compact(
    _.flatten(
      passage.tagged.map((sentence, idx) =>
        sentence.map(
          (word, idx2) => word.isConnector && [word.value, idx, idx2]
        )
      ),
      1
    )
  )

const BLANK = [{ value: "_underline_" }, { value: ".", isPunctuation: true }]

const question = passage => {
  const data = _.sample(locateConnectors(passage))

  if (!data) {
    return
  }

  const [connector, sentenceIdx, wordIdx] = data

  let params = {}

  const tagged = _.map(passage.tagged, _.clone)

  const value = tagged[sentenceIdx]
    .splice(wordIdx)
    .map(a => a.value)
    .join(" ")

  tagged[sentenceIdx][wordIdx] = { highlight: true, value }

  params.answer = _.flatten(tagged).map(p => ({
    value: p.value,
    prefill: !p.highlight
  }))

  params.redHerrings = ["not this", "or this", "and this"]

  return params
}

module.exports = doc => doc.passages.map(question)
