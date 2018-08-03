const _ = require("underscore")

const ImageModel = require("../../../models/image")

const toBase64 = doc => "data:image/jpg;base64," + doc.buf.toString("base64")

module.exports = async (doc, redHerringDocs, reverse) =>
  Promise.all(
    doc.images.map(async id => {
      const questions = []

      const imageBase64 = toBase64(await ImageModel.findById(id))

      if (reverse === true || reverse === undefined) {
        let params = {}
        params.prompt = [{ value: doc.value, highlight: false }]
        params.answer = [{ value: imageBase64, prefill: false }]
        params.redHerrings = _
          .sample(await ImageModel.find({ _id: { $ne: id } }), 5)
          .map(toBase64)
        questions.push(params)
      }

      if (reverse === false || reverse === undefined) {
        let params = {}
        params.prompt = [{ value: imageBase64, highlight: false }]
        params.answer = [{ value: doc.value, prefill: false }]
        params.redHerrings = _.sample(redHerringDocs.map(d => d.value), 5)
        questions.push(params)
      }

      return questions
    })
  )
