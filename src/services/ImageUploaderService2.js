require("../lib/db")()

const fs = require("fs")

const ImageModel = require("../models/image")
const WordModel = require("../models/word")

const { enrich } = require("./OxfordDictionaryService")

const dataDir = process.argv[2]

const base64encode = file =>
  new Buffer(fs.readFileSync(`${dataDir}/images/${file}`))

const findOrCreateWord = async value => {
  let word

  word = await WordModel.findOne({ value })

  if (!word) {
    const unverified = await enrich(value)
    word = await WordModel.create({ value, unverified })
  }

  return word._id
}

const uploadImage = async data => {
  let { image, words } = data

  console.log("words: " + words.join(", "))
  const buf = base64encode(image)
  words = await Promise.all(words.map(findOrCreateWord))

  ImageModel.create({ buf, words }, (error, image) => {
    if (error) {
      throw new Error(error.message)
    }

    console.log(image._id + "image created")

    WordModel.updateMany(
      { _id: { $in: words } },
      {
        $push: { images: [image._id] }
      },
      { new: true }
    )
  })
}

fs.readFile(dataDir + "/data.txt", "utf8", (err, data) => {
  if (err) throw err
  JSON.parse(data).forEach(uploadImage)
})
