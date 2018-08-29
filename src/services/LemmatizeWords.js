require("../lib/db")()

const WordModel = require("../models/word")
const lemmatizations = JSON.parse(require("./lemmatizations.json"))

const run = async () => {
  const words = await WordModel.find({
    value: { $in: Object.keys(lemmatizations) }
  })

  const promises = words.map(async word => {
    word.otherForms = lemmatizations[word.value]
    return await word.save()
  })

  await Promise.all(promises)
  process.exit(0)
}

run()
