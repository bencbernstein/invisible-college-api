require("../lib/db")()

const http = require("http")
const WordModel = require("../models/word")

const url = "http://desolate-plains-35942.herokuapp.com/api/v2/words"

http.get(url, res => {
  let data = ""
  res.on("data", chunk => (data += chunk))
  res.on("end", () => {
    const wordsArr = JSON.parse(data)

    let bulk = []

    for (let word of wordsArr) {
      const value = word.value
      const isDecomposable = true
      const components = word.components.map(c => ({
        value: c.value,
        isRoot: c.componentType === "root"
      }))
      const definition = word.definition.filter(c => c.value !== "").map(c => ({
        value: c.value,
        highlight: c.isRoot
      }))
      const obscurity = word.obscurity

      const document = {
        value,
        isDecomposable,
        components,
        definition,
        obscurity
      }

      bulk.push({ insertOne: { document } })
    }

    WordModel.bulkWrite(bulk)
      .then((error, bulkWriteOpResult) => {
        console.log(error)
        console.log(bulkWriteOpResult)
      })
      .catch(err => console.log(err))
  })
})
