const mongoose = require("mongoose")
const { flatten, get, uniq } = require("lodash")

const ImageModel = require("../../models/image")
const WordModel = require("../../models/word")

const imageTypeDefs = `
type Image {
  id: ID
  url: String
  caption: String
  location: String
  wordValues: [String]
  firstWordValue: String
}

extend type Query {
  image: Image
  images(search: String): [Image]
}
`

const imageResolvers = {
  Query: {
    image() {
      return ImageModel.findOne().catch(err => new Error(err))
    },

    async images(_, params) {
      const images = await ImageModel.find({}, { url: 1, words: 1 })
      const ids = uniq(flatten(images.map(i => i.words)))
      const words = await WordModel.find({ _id: { $in: ids } }, { value: 1 })

      images.forEach(image => {
        image.wordValues = image.words
          .map(id => get(words.find(word => word._id.equals(id)), "value"))
          .filter(val => val)
          .sort((a, b) => a.localeCompare(b))
        image.firstWordValue = image.wordValues[0]
      })

      const filtered = images.filter(
        i =>
          i.wordValues.length &&
          (!params.search ||
            i.wordValues.some(w => w.indexOf(params.search) > -1))
      )

      return filtered.slice(0, 75)
    }
  }
}

module.exports = { imageTypeDefs, imageResolvers }
