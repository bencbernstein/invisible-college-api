require("../lib/db")()

const { uniq } = require("underscore")
const mongoose = require("mongoose")

const WordModel = require("../models/word")
const PassageModel = require("../models/passage")
const QuestionModel = require("../models/question")

const run = async () => {
  const passages = await PassageModel.find({ status: "enriched" })
  const wordCounts = []

  for (const passage of passages) {
    const filteredWords = uniq(
      passage
        .filtered()
        .map(({ wordId }) => wordId)
        .filter(id => id)
    )
    const ids = await passage.wordIds()
    const wordCount = await passage.wordCount()
    wordCounts.push(wordCount)
    const words = await WordModel.find(
      { _id: { $in: ids } },
      { obscurity: 1, _id: 0 }
    )
    const obscurities = words.map(({ obscurity }) => obscurity).filter(o => o)
    const obscurity = obscurities.length ? Math.max(...obscurities) : null
    const lengthDifficulty = Math.min(10, Math.round(wordCount / 10))

    const difficulty = obscurity
      ? Math.round((obscurity + lengthDifficulty) / 2)
      : lengthDifficulty

    await PassageModel.updateOne(
      { _id: passage._id },
      { $set: { difficulty, filteredWords } }
    )

    await QuestionModel.updateMany(
      {
        "sources.passage.id": passage._id
      },
      {
        $set: { passageDifficulty: difficulty }
      }
    )
  }

  console.log("done")
  return process.exit(0)
}

run()
