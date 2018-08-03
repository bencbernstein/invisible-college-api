require("../lib/db")()

const http = require("http")
const ChoiceSetModel = require("../models/choiceSet")

const url = "http://desolate-plains-35942.herokuapp.com/api/v2/choiceSet"

http.get(url, res => {
  let data = ""
  res.on("data", chunk => (data += chunk))
  res.on("end", () => {
    const arr = JSON.parse(data)

    let bulk = []

    for (let d of arr) {
      const category = d.category.toLowerCase()
      const name = d.name.toLowerCase()
      const choices = d.choices.map(c => c.value)

      const document = {
        category,
        name,
        choices
      }

      bulk.push({ insertOne: { document } })
    }

    ChoiceSetModel.bulkWrite(bulk)
      .then((error, bulkWriteOpResult) => {
        console.log(error)
        console.log(bulkWriteOpResult)
      })
      .catch(err => console.log(err))
  })
})
