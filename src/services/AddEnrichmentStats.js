require("../lib/db")()

const Text = require("../models/text")

const run = async () => {
  const texts = await Text.find()

  for (let text of texts) {
    text.passagesCount = text.passages.length
    text.unenrichedPassagesCount = text.passages.length
    text.passages.forEach(p => (p.isEnriched = false))
    try {
      await text.save((err, update) => console.log(err || "success"))
    } catch (e) {
      console.log(e)
    }
  }
}

run()
