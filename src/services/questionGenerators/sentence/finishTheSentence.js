const PartialSentenceModel = require("../../../models/partialSentence")
const WordModel = require("../../../models/word")

const { isPunc, condensePrompt } = require("../../../lib/helpers")

const makeQuestion = len => len >= 6 && len <= 12

const createPartialSentence = (tagged, start, len) =>
  JSON.parse(JSON.stringify(tagged))
    .splice(start, len)
    .map(t => (isPunc(t.value) ? t.value : ` ${t.value}`))
    .join("")
    .trim()

module.exports = async (passage, sources, generatePartialSentences = false) => {
  const questions = []
  const partialSentences = []
  const { tagged, id } = passage
  const TYPE = "Complete the Sentence"
  let len = 0

  for (const [idx, tag] of tagged.entries()) {
    const { isPunctuation, isConnector, isSentenceConnecter } = tag

    if (tag.value === ".") {
      len = 0
    } else {
      if (isConnector) {
        const connector = tag.value
        const lenUntilEnd = tagged.slice(idx).findIndex(t => t.value === ".")

        const createQuestion = async (position, startIdx, len) => {
          const value = createPartialSentence(tagged, startIdx, len)
          const partialSentence = { passage: id, connector, value, position }

          if (generatePartialSentences) {
            partialSentences.push(partialSentence)
            return
          }

          const copy = JSON.parse(JSON.stringify(tagged)).map(({ value }) => ({
            value
          }))
          const spliceIdx = idx - position === "start" ? len : 0
          copy.splice(spliceIdx, len, { value, hide: true })
          const answer = [{ value, prefill: false }]
          const prompt = condensePrompt(copy)
          const query = { connector, position, passage: { $ne: id } }
          const redHerrings = (await PartialSentenceModel.find(query).limit(
            3
          )).map(p => p.value)

          if (redHerrings.length === 3) {
            questions.push({ TYPE, answer, prompt, redHerrings, sources })
          }

          return
        }

        if (makeQuestion(len)) {
          await createQuestion("start", idx - len, len)
        }

        if (makeQuestion(lenUntilEnd)) {
          await createQuestion("end", idx, lenUntilEnd + 1)
        }
      }

      len += 1
    }
  }

  if (generatePartialSentences) {
    const results = await PartialSentenceModel.create(partialSentences)
    console.log(`Created ${results.length} partial sentences for ${id}.`)
  } else {
    return questions
  }
}
