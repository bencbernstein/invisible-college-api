const ChoiceSetModel = require("../../../models/choiceSet")
const WordModel = require("../../../models/word")
const { sample, without, flatten } = require("underscore")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

module.exports = async (passage, passages, sources) => {
  const { tagged } = passage

  const questions = []

  for (const [idx, tag] of tagged.entries()) {
    const { value, isUnfocused, wordId, choiceSetId } = tag

    if (isUnfocused || (!wordId && !choiceSetId)) {
      continue
    }

    for (const makeWrong of [true, false]) {
      let params = { sources }
      let followUpParams = { sources }
      let reverseParams = { sources }
      let herring, herrings

      if (wordId) {
        const wordDoc = await WordModel.findById(wordId)
        // Red herrings aren't good for non-decomposable words
        const herringDocs = await WordModel.redHerring(wordDoc)
        herrings = herringDocs.map(h => h.value)
      } else {
        const choiceSet = await ChoiceSetModel.findById(choiceSetId)
        herrings = without(choiceSet.choices, value)
      }

      herring = sample(herrings)

      params.TYPE = "Passage to Truth"
      params.prompt = condensePrompt(
        tagged.map((word, idx2) => {
          if (word.isSentenceConnector) {
            return word
          }
          const params = {
            value: idx === idx2 && makeWrong ? herring : word.value
          }
          if (idx === idx2) {
            params.highlight = true
          }
          return params
        })
      )
      params.answer = [{ prefill: false, value: makeWrong ? "FALSE" : "TRUE" }]
      params.redHerrings = [makeWrong ? "TRUE" : "FALSE"]
      questions.push(params)

      if (makeWrong) {
        followUpParams.TYPE = "Fill in the Blank"
        followUpParams.prompt = condensePrompt(
          params.prompt.map(({ value, highlight }) => {
            const elem = { value }
            if (highlight) {
              elem.hide = true
            }
            return elem
          })
        )
        followUpParams.answer = [{ value, prefill: false }]
        followUpParams.redHerrings = herrings

        reverseParams.TYPE = "Passage to Truth (reverse)"
        reverseParams.prompt = [
          { value: "Find the wrong word in the passage.", highlight: false }
        ]
        reverseParams.interactive = condenseInteractive(
          params.prompt.map(({ value, highlight }) => {
            const elem = { value: highlight ? sample(herrings) : value }
            if (highlight) {
              elem.correct = true
            }
            return elem
          })
        )
        reverseParams.answerCount = 1

        questions.push(...[followUpParams, reverseParams])
      }
    }
  }

  return questions
}
