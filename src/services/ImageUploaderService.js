require("../lib/db")()

const ImageModel = require("../models/image")
const WordModel = require("../models/word")

const fs = require("fs")

const imageDir = process.argv[2]

const base64encode = file => new Buffer(fs.readFileSync(`${imageDir}/${file}`))

const uploadImage = file => {
  const value = file.split(".")[0]

  WordModel.findOne({ value }, (error, word) => {
    if (error || !word) {
      return
    }

    const buf = base64encode(file)
    const words = [word._id]

    ImageModel.create({ buf, words }, (error, image) => {
      if (error) {
        throw new Error(error.message)
      }

      console.log(image._id + " - " + value + " created")

      WordModel.findByIdAndUpdate(
        words[0],
        {
          $set: { images: [image._id] }
        },
        { new: true },
        (error, word) => {
          console.log(word.value + " updated")
        }
      )
    })
  })
}

fs.readdir(imageDir, (err, files) => {
  if (err) {
    throw new Error("directory not found")
  }

  files.forEach(uploadImage)
})
