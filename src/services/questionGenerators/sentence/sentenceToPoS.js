const _ = require("underscore")

const PART_OF_SPEECH = {
  PRP: "personal pronoun",
  VBD: "verb, past tense",
  JJ: "adjective",
  NN: "noun",
  NNS: "noun, plural",
  VB: "verb, base form",
  VBN: "verb, past participle",
  IN: "preposition or subordinating conjunction",
  DT: "determiner",
  JJS: "adjective, superlative",
  NNP: "proper noun, singular",
  POS: "possessive ending",
  NNPS: "proper noun, plural",
  RB: "adverb",
  CC: "coordinating conjunction",
  MD: "modal"
}

const question = passage => {
  let questions = []

  for (let sentence of passage.tagged) {
    const focusWordIndices = _.findIndex(sentence, word => word.isFocusWord)

    const indices = sentence
      .map((word, idx) => word.isFocusWord && idx)
      .filter(idx => idx > -1)

    questions = questions.concat(
      indices.map(idx => {
        let params = {}

        params.prompt = sentence.map((word, idx2) => ({
          value: word.value,
          highlight: idx === idx2
        }))

        const answer = sentence[idx].tag
        params.answer = [{ value: PART_OF_SPEECH[answer], prefill: false }]

        params.redHerrings = _.sample(
          _.without(_.values(PART_OF_SPEECH), PART_OF_SPEECH[answer]),
          5
        )

        return params
      })
    )
  }

  return questions
}

module.exports = doc => doc.passages.map(question)
