const async = require("async")
const natural = require("natural")
const Busboy = require("busboy")
const elasticsearch = require("elasticsearch")
const { chunk, flatten } = require("lodash")
const uuidv4 = require("uuid/v4")

const client = new elasticsearch.Client({
  host: [
    {
      host: "ee2174119d634def91a0a4b2a91c19e4.us-east-1.aws.found.io",
      auth: "elastic:3y44M8nGXMrppI9OQWikcxZZ",
      protocol: "https",
      port: 9243
    }
  ]
})

const ROB = true

exports.parse = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  const tokenizer = new natural.SentenceTokenizer()

  const documents = []

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    let str = ""

    file.on("data", data => (str += data.toString("utf8")))

    file.on("end", async () => {
      const tokenized = tokenizer.tokenize(str)

      const text = [
        {
          index: {
            _index: "my_index",
            _type: "_doc",
            _id: uuidv4()
          }
        },
        { title: filename, join_field: { name: "book" } }
      ]

      const chunked = chunk(tokenized, 10)

      const passages = chunked.map((sentences, section) => [
        {
          index: {
            _index: "my_index",
            _type: "_doc"
          }
        },
        {
          sentences,
          section,
          join_field: {
            name: "passage",
            parent: text[0].index._id
          }
        }
      ])

      documents.push(flatten(text.concat(...passages)))
      const finished = String(documents.length) === req.query.count
      if (!finished) return

      const params = {
        body: flatten(documents),
        refresh: "wait_for",
        routing: 1
      }

      client.bulk(params, (error, bulkResponse) => {
        // bulkResponse.items.forEach(i => console.log(i.index))
        // TODO: - docs could error
        return error
          ? res.status(422).send({ error: error.message })
          : res.status(201).send({ success: true })
      })
    })
  })

  req.pipe(busboy)
}
