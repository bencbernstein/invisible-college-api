const { sample } = require("underscore")

const ImageModel = require("../../../models/image")

module.exports = async (doc, redHerringDocs, sources, daisyChain) =>
  Promise.all(
    doc.images.map(async id => {
      const questions = []
      const params = { sources, daisyChain, difficulty: 3 }
      const reverseParams = { sources, daisyChain, difficulty: 3 }

      const imageDoc = await ImageModel.findById(id)
      if (!imageDoc) return []

      params.TYPE = "Word to Image"
      params.prompt = [{ value: doc.value, highlight: false }]
      params.answer = [{ value: imageDoc.url, prefill: false }]
      params.redHerrings = sample(
        await ImageModel.find({ _id: { $ne: id } }),
        1
      ).map(({ url }) => url)
      questions.push(params)

      reverseParams.TYPE = "Word to Image (reverse)"
      reverseParams.prompt = [{ value: imageDoc.url, highlight: false }]
      reverseParams.answer = [{ value: doc.value, prefill: false }]
      reverseParams.redHerrings = sample(redHerringDocs.map(d => d.value), 5)
      questions.push(reverseParams)

      return questions
    })
  )
