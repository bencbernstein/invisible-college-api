const ChoiceSetModel = require("../../../models/choiceSet")
const _ = require("underscore")

module.exports = async sentences => {
  const choiceSets = (await ChoiceSetModel.find({}, { choices: 1 })).map(
    doc => doc.choices
  )

  return sentences.map(sentence =>
    sentence.map((word, wordIdx) => {
      const idx = _.findIndex(choiceSets, set => set.includes(word.value))

      if (idx > -1) {
        let params = {}

        const coinflip = Math.random() > 0.5

        const highlightedWord = coinflip
          ? word.value
          : _.sample(_.without(choiceSets[idx], word.value))

        params.prompt = sentence.map((word, wordIdx2) => ({
          value: wordIdx === wordIdx2 ? highlightedWord : word.value,
          highlight: wordIdx === wordIdx2
        }))

        params.answer = [{ prefill: false, value: coinflip ? "true" : "false" }]
        params.redHerrings = [coinflip ? "false" : "true"]

        return params
      }
    })
  )
}
