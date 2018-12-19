const { without, shuffle, sample } = require("underscore")
const WordModel = require("../../../models/word")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

module.exports = async (passage, sources) => {
  const questions = []

  const ids = passage.tagged.map(t => t.wordId).filter(id => id)
  const words = await WordModel.find({ _id: { $in: ids } }, { otherForms: 1 })

  passage.tagged.forEach((tag, idx) => {
    const wordIdx = words.findIndex(word => word._id.equals(tag.wordId))
    const otherForms = wordIdx > -1 ? words[wordIdx].otherForms : []
    const allForms = shuffle(otherForms.concat(tag.value))
    let TYPE

    if (allForms.length > 2) {
      TYPE = "Swap Lemma"
      const value = tag.value
      const redHerrings = without(allForms, value).slice(0, 6)
      const answer = [{ value, prefill: false }]

      const prompt = condensePrompt(
        passage.tagged.map((tag2, idx2) =>
          idx === idx2
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
        passage.tagged.map((tag2, idx2) => ({
          value: idx === idx2 ? redHerring : tag2.value,
          correct: idx === idx2
        }))
      )

      questions.push({ TYPE, prompt, interactive, answerCount: 1, sources })
    }
  })

  return questions
}
