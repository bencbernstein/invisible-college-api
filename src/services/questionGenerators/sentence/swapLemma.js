const { without, shuffle, sample } = require("underscore")
const WordModel = require("../../../models/word")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

module.exports = async (passage, passages, sources) => {
  const { tagged } = passage
  const questions = []

  const ids = tagged.map(tag => tag.wordId).filter(id => id)
  const words = await WordModel.find({ _id: { $in: ids } }, { otherForms: 1 })

  tagged.forEach((tag, tagIdx) => {
    const wordIdx = words.findIndex(word => word._id.equals(tag.wordId))
    const otherForms = wordIdx > -1 ? words[wordIdx].otherForms : []
    const allForms = shuffle(otherForms.concat(tag.value))
    let TYPE

    if (allForms.length > 2) {
      TYPE = "Swap Lemma"
      const value = tag.value
      const redHerrings = without(allForms, value).slice(0, 7)
      const answer = [{ value, prefill: false }]

      const prompt = condensePrompt(
        tagged.map(
          (tag2, tagIdx2) =>
            tagIdx === tagIdx2
              ? { highlight: true, value: redHerrings.shift() }
              : { highlight: false, value: tag2.value }
        )
      )

      questions.push({ TYPE, prompt, redHerrings, answer, sources })
    }

    if (allForms.length > 1) {
      TYPE = "Swap Lemma (reverse)"
      const value = tag.value
      const redHerring = sample(without(allForms, value))
      const prompt = [
        { value: "Find the ungrammatical word", highlight: false }
      ]

      const interactive = condenseInteractive(
        tagged.map((tag2, tagIdx2) => ({
          value: tagIdx === tagIdx2 ? redHerring : tag2.value,
          correct: tagIdx === tagIdx2
        }))
      )

      questions.push({ TYPE, prompt, interactive, answerCount: 1, sources })
    }
  })

  return questions
}
