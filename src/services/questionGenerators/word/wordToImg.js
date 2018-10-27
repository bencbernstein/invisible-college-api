const { sample } = require("underscore")

const ImageModel = require("../../../models/image")

const toBase64 = doc => "data:image/jpg;base64," + doc.buf.toString("base64")

module.exports = async (doc, redHerringDocs, sources, difficulty) =>
  Promise.all(
    doc.images.map(async id => {
      const questions = []
      const params = { sources, difficulty }
      const reverseParams = { sources, difficulty }

      const imageDoc = await ImageModel.findById(id)

      if (!imageDoc) {
        return []
      }

      const imageBase64 = toBase64(imageDoc)

      params.TYPE = "Word to Image"
      params.prompt = [{ value: doc.value, highlight: false }]
      params.answer = [{ value: imageBase64, prefill: false }]
      params.redHerrings = sample(
        await ImageModel.find({ _id: { $ne: id } }),
        1
      ).map(toBase64)
      questions.push(params)

      reverseParams.TYPE = "Word to Image (reverse)"
      reverseParams.prompt = [{ value: imageBase64, highlight: false }]
      reverseParams.answer = [{ value: doc.value, prefill: false }]
      reverseParams.redHerrings = sample(redHerringDocs.map(d => d.value), 5)
      questions.push(reverseParams)

      return questions
    })
  )
