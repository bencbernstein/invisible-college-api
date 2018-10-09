require("../lib/db")()

const PassageModel = require("../models/passage")
const WordModel = require("../models/word")

const ATTRS = ["accepted", "rejected", "enriched", "unfiltered"]

const run = async () => {
  try {
    const words = await WordModel.find({ "passages.0": { $exists: true } })

    for (let word of words) {
      const passages = await PassageModel.find(
        { _id: { $in: word.passages } },
        { status: 1 }
      )
      ATTRS.forEach(attr => {
        word[`${attr}PassagesCount`] = passages.filter(
          p => p.status === attr
        ).length
      })
      console.log(`Setting passage counts for ${word.value}`)
      await word.save()
    }
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

run()
