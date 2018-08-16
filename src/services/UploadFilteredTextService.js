require("../lib/db")()

const filteredTexts = require("./filteredTexts.json")

const Text = require("../models/text")

Text.create(filteredTexts, (error, result) => {
  console.log(error || "success")
})
