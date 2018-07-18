const natural = require("natural")
const Busboy = require("busboy")
const _ = require("underscore")

const TextModel = require("../models/text")
const WordModel = require("../models/word")

exports.parse = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })

  const { name, source } = req.query

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    let text = ""

    file.on("data", data => (text += data.toString("utf8")))

    file.on("end", async () => {
      const tokenizer = new natural.SentenceTokenizer()
      let tokenized = tokenizer.tokenize(text)

      const words = _.pluck(await WordModel.find({}, { value: 1 }), "value")

      tokenized = tokenized.map(sentence => ({
        sentence,
        found: words.filter(word => sentence.includes(word))
      }))

      const doc = new TextModel({
        name,
        source,
        tokenized: JSON.stringify(tokenized)
      })

      try {
        await doc.save()
        return res.status(201).send(doc)
      } catch (error) {
        return res.status(422).send({ error: error.message })
      }
    })
  })

  req.pipe(busboy)
}
