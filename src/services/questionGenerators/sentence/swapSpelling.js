const { without, shuffle, sample } = require("underscore")

const { condensePrompt, condenseInteractive } = require("../../../lib/helpers")

const misspellings = require("./data/misspellings")

module.exports = async (passage, sources) => {
  const questions = []

  passage.focusWordIndices().forEach(idx => {
    const { value } = passage.tagged[idx]

    const redHerrings = sample(misspellings(value), 6)
    const redHerring = redHerrings.shift()

    if (redHerring) {
      const TYPE = "Swap Spelling (reverse)"
      const prompt = [{ value: "Find the mis-spelled word", highlight: false }]
      const interactive = condenseInteractive(
        passage.tagged.map((tag, idx2) => ({
          value: idx === idx2 ? redHerring : tag.value,
          correct: idx === idx2
        }))
      )
      questions.push({ TYPE, prompt, interactive, sources, answerCount: 1 })
    }

    if (redHerrings.length) {
      const TYPE = "Swap Spelling"
      const answer = [{ value, prefill: false }]
      const prompt = condensePrompt(
        passage.tagged.map((tag, idx2) =>
          idx === idx2
            ? { highlight: true, value: redHerring }
            : { value: tag.value }
        )
      )
      questions.push({ TYPE, prompt, redHerrings, sources, answer })
    }
  })

  return questions
}
