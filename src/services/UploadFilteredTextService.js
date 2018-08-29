require("../lib/db")()

const filteredTexts = require("./texts_for_upload.json")

const Text = require("../models/text")

Text.create(filteredTexts, (error, result) => {
  console.log(error || "success")
  process.exit(0)
})
