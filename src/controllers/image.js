const Busboy = require("busboy")
const stream = require("stream")
ObjectId = require("mongodb").ObjectID

const CONFIG = require("../lib/config")

const ImageModel = require("../models/image")
const WordModel = require("../models/word")

exports.parse = async (req, res, next) => {
  const { id, ids, action } = req.query

  if (action === "GET") {
    const query = ids ? { _id: { $in: ids.split(",") } } : {}

    ImageModel.find(query, (error, images) => {
      const base64 = images.map(i => ({
        base64: "data:image/jpg;base64," + i.buf.toString("base64"),
        id: i._id
      }))

      return error
        ? res.status(422).send({ error: error.message })
        : res.status(200).send(base64)
    })
  } else if (action === "DELETE") {
    const [wordId, imageId] = ids.split(",")

    WordModel.findByIdAndUpdate(
      wordId,
      { $pull: { images: imageId } },
      { new: true },
      (err, word) =>
        err
          ? res.status(422).send({ err: err.message })
          : res.status(200).send(word)
    )
  }
}

exports.create = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  const { id } = req.query
  let output = new stream.PassThrough()
  let base64 = ""

  busboy
    .on("file", async (fieldname, file, filename, encoding, mimetype) => {
      file.setEncoding("base64")
      file.on("data", data => (base64 += data))
    })
    .on("finish", () => {
      const buf = new Buffer(base64, "base64")
      const words = [id]

      ImageModel.create({ buf, words }, (error, image) => {
        if (error) {
          return res.status(422).send({ error: error.message })
        }
        WordModel.findByIdAndUpdate(
          words[0],
          {
            $push: { images: image._id }
          },
          { new: true },
          (err, word) => res.status(201).send({ image, word })
        )
      })
    })

  req.pipe(busboy)
}
