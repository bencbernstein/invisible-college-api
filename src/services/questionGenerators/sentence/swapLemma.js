const { findIndex, without, shuffle, sample } = require("underscore")
const WordModel = require("../../../models/word")

// Use this for interactive prompt?
const condensePrompt = prompt => {
  const condensed = []
  prompt.forEach(tag => {
    if (condensed.length) {
      let { value, highlight } = condensed[condensed.length - 1]
      if (highlight === tag.highlight) {
        value += ` ${tag.value}`
        condensed[condensed.length - 1] = { value, highlight }
        return
      }
    }
    condensed.push(tag)
  })
  return condensed
}

const regular = async passage => {
  const questions = []

  const ids = passage.tagged.map(tag => tag.wordId).filter(id => id)
  const words = await WordModel.find({ _id: { $in: ids } }, { otherForms: 1 })

  passage.tagged.forEach((tag, tagIdx) => {
    const wordIdx = findIndex(words, word => word._id.equals(tag.wordId))
    const otherForms = wordIdx > -1 ? words[wordIdx].otherForms : []
    const allForms = shuffle(otherForms.concat(tag.value))

    if (allForms.length > 2) {
      const value = tag.value
      const redHerrings = without(allForms, value).slice(0, 7)
      const answer = [{ value, prefill: false }]
      let prompt = passage.tagged.map(
        (tag2, tagIdx2) =>
          tagIdx === tagIdx2
            ? { highlight: true, value: redHerrings.shift() }
            : { highlight: false, value: tag2.value }
      )
      prompt = condensePrompt(prompt)
      questions.push({ prompt, redHerrings, answer })
    }
  })

  return questions
}

// TODO: - regular and reversed can be combined
const reversed = async passage => {
  const questions = []

  const ids = passage.tagged.map(tag => tag.wordId).filter(id => id)
  const words = await WordModel.find({ _id: { $in: ids } }, { otherForms: 1 })

  passage.tagged.forEach((tag, tagIdx) => {
    const wordIdx = findIndex(words, word => word._id.equals(tag.wordId))
    const otherForms = wordIdx > -1 ? words[wordIdx].otherForms : []
    const allForms = shuffle(otherForms.concat(tag.value))

    if (allForms.length > 1) {
      const value = tag.value
      const redHerring = sample(without(allForms, value))

      const prompt = [
        { value: "Find the ungrammatical word", highlight: false }
      ]

      const interactive = passage.tagged.map((tag2, tagIdx2) => ({
        value: tagIdx === tagIdx2 ? redHerring : tag2.value,
        correct: tagIdx === tagIdx2
      }))

      questions.push({ prompt, interactive, answerCount: 1 })
    }
  })

  return questions
}

module.exports = async (passage, passages, reverse) =>
  reverse ? reversed(passage) : regular(passage)
