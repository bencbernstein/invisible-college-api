const { find, extend, sample } = require("underscore")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ImageModel = require("./image")
const QuestionModel = require("./question")
const PassageModel = require("./passage")

var wordSchema = new Schema({
  value: { type: String, required: true },
  isDecomposable: { type: Boolean, required: true, default: false },
  synonyms: { type: [String], default: [] },
  lcd: String,
  otherForms: { type: [String] },
  components: {
    type: [
      {
        isRoot: { type: Boolean, required: true },
        value: { type: String, required: true }
      }
    ]
  },
  definition: {
    type: [
      {
        highlight: { type: Boolean, required: true },
        value: { type: String, required: true }
      }
    ],
    default: []
  },
  tags: {
    type: [
      {
        value: { type: String, required: true },
        id: { type: Schema.Types.ObjectId },
        choiceSetIds: { type: [Schema.Types.ObjectId], default: [] }
      }
    ],
    default: []
  },
  unverified: {
    type: {
      tags: [String],
      synonyms: [String],
      definition: String
    },
    default: {}
  },
  obscurity: { type: Number, required: true, default: 3 },
  images: { type: [Schema.Types.ObjectId], required: true, default: [] },
  passages: { type: [Schema.Types.ObjectId], required: true, default: [] },
  unfilteredPassagesCount: { type: Number, required: true, default: 0 },
  rejectedPassagesCount: { type: Number, required: true, default: 0 },
  acceptedPassagesCount: { type: Number, required: true, default: 0 },
  enrichedPassagesCount: { type: Number, required: true, default: 0 },
  sharesRoot: [Schema.Types.ObjectId]
})

wordSchema.statics.allForms = async function() {
  const words = await this.find({}, { value: 1, otherForms: 1 })
  return words.map(({ _id, otherForms, value }) => ({
    _id,
    values: otherForms.concat(value)
  }))
}

wordSchema.methods.simpleDefinition = function() {
  return this.definition.map(d => d.value).join("")
}

wordSchema.methods.daisyChain = function() {
  if (this.sharesRoot.length) {
    return QuestionModel.findOne({
      "sources.word.id": { $in: this.sharesRoot },
      difficulty: { $lt: 3 }
    })
  }
}

wordSchema.methods.imageDocs = function() {
  if (this.images.length === 0) {
    return []
  }
  return ImageModel.find({ _id: { $in: this.images } })
}

wordSchema.methods.passageDocs = function(status) {
  if (this.passages === 0) {
    return []
  }
  const query = { _id: { $in: this.passages } }
  if (status) {
    query.status = status
  }
  return PassageModel.find(query)
}

wordSchema.methods.highlightedDefinition = function() {
  return this.definition.map(d => ({ value: d.value, highlight: d.highlight }))
}

wordSchema.methods.unHighlightedDefinition = function() {
  return this.definition.map(d => ({ value: d.value, highlight: false }))
}

wordSchema.methods.rootIndices = function() {
  return this.components.map((c, i) => (c.isRoot ? i : -1)).filter(i => i > -1)
}

wordSchema.methods.hasMultipleRoots = function() {
  return this.rootIndices().length > 1
}

wordSchema.methods.rootValues = function() {
  return this.isDecomposable
    ? this.components.filter(c => c.isRoot).map(c => c.value)
    : []
}

wordSchema.statics.redHerring = async function(doc) {
  const basicQuery = {
    value: { $ne: doc.value }
  }

  if (doc.isDecomposable) {
    const rootValue = find(doc.components, c => c.isRoot).value
    const rootQuery = extend({}, basicQuery, {
      components: { $elemMatch: { value: rootValue, isRoot: true } }
    })
    const redHerrings = await this.find(rootQuery).limit(5)
    if (redHerrings.length) {
      return redHerrings
    }
  }

  return this.find(basicQuery).limit(5)
}

wordSchema.statics.updatePassageStatus = async function updatePassageStatus(
  id,
  from,
  to
) {
  if (from === to) {
    return
  }
  const words = await this.find({ passages: id })
  words.forEach(w => {
    w[`${from}PassagesCount`] -= 1
    w[`${to}PassagesCount`] += 1
  })
  return Promise.all(words.map(w => w.save()))
}

wordSchema.pre("save", async function(next) {
  const images = await ImageModel.find({ words: this.value })
  if (images.length) {
    this.images = images.map(i => i._id)
  }
  next()
})

const Model = mongoose.model("Word", wordSchema)
module.exports = Model
