const ChoiceSetModel = require("../../../models/choiceSet")
const _ = require("underscore")

const questions = (sentence, choiceSets) =>
  sentence.map((word, wordIndex) => {
    const choiceSet = _.find(choiceSets, s => s.includes(word.value))

    if (choiceSet) {
      let params = {}

      const makeWrong = choiceSet.length > 2 && Math.random() > 0.5
      const redHerring = _.sample(_.without(choiceSet, word.value))

      params.prompt = sentence.map((word, wordIndex2) => ({
        value: wordIndex === wordIndex2 && makeWrong ? redHerring : word.value,
        highlight: wordIndex === wordIndex2
      }))

      params.answer = [{ prefill: false, value: makeWrong ? "FALSE" : "TRUE" }]
      params.redHerrings = [makeWrong ? "TRUE" : "FALSE"]

      if (makeWrong) {
        let params2 = {}

        params2.prompt = params.prompt.map((data, wordIndex2) => ({
          value:
            wordIndex === wordIndex2
              ? "_".repeat(redHerring.length)
              : data.value,
          highlight: data.highlight
        }))
        params2.answer = [{ prefill: false, value: word.value }]
        params2.redHerrings = _.without(choiceSet, word.value, redHerring)

        return [params, params2]
      }

      return params
    }
  })

module.exports = async sentences => {
  const docs = await ChoiceSetModel.find({}, { choices: 1 })
  const choiceSets = docs.map(d => d.choices)
  return sentences.map(s => questions(s, choiceSets))
}
