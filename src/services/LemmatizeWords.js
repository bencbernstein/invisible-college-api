require("../lib/db")()

const WordModel = require("../models/word")

const axios = require("axios")

const DISCOVER_API_URL = require("../lib/config").DISCOVER_API_URL

const run = async () => {
  const words = await WordModel.find({ otherForms: { $exists: false } })

  for (let word of words) {
    console.log("getting lemmatizations for " + word.value)
    const url = DISCOVER_API_URL + "lemmatizations?word=" + word.value
    const data = await axios
      .get(url)
      .then(async res => {
        const { lcd, lemmas } = res.data
        await WordModel.findByIdAndUpdate(word._id, {
          $set: { lcd, otherForms: lemmas }
        })
      })
      .catch(error => console.log(error.message))
  }

  return process.exit(0)
}

run()
