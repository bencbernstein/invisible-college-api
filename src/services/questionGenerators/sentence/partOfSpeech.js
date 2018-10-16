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

const makeQuestionFor = word => {
  return (
    word.isFocusWord || ((word.wordId || word.choiceSetId) && !word.isUnfocused)
  )
}

const toSentences = tags => {
  const sentences = [[]]
  let senIdx = 0
  tags.forEach(tag => {
    if (tag.isSentenceConnector) {
      senIdx += 1
      sentences.push([])
    } else {
      sentences[senIdx].push(tag)
    }
  })
  return sentences
}

const filterPassage = passage =>
  _.flatten(
    toSentences(passage.tagged).filter((s, idx) =>
      _.includes(passage.filteredSentences, idx)
    )
  )

module.exports = passage => {
  const questions = []

  const filtered = filterPassage(passage)

  const focusWordIndices = filtered
    .map((word, i) => (makeQuestionFor(word) ? i : -1))
    .filter(i => i > -1)

  focusWordIndices.forEach(idx => {
    const prompt = filtered.map((word, idx2) => {
      let params = { value: word.value }
      if (idx === idx2) {
        params.highlight = true
      }
      return params
    })
    const value = PART_OF_SPEECH[filtered[idx].tag]
    const answer = [{ value, prefill: false }]
    const redHerrings = _.sample(_.without(_.values(PART_OF_SPEECH), value), 5)
    return questions.push({ prompt, answer, redHerrings })
  })

  return questions
}
