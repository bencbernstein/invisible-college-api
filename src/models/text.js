const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CATEGORIES = require("../lib/categories")

const ENTITIES = [
  "person",
  "place",
  "organization",
  "date",
  "misc",
  "money",
  "percent",
  "date",
  "time"
]

var textSchema = new Schema(
  {
    name: { type: String, required: true },
    source: { type: String, required: true },
    tokenized: { type: String, required: true },
    isPreFiltered: { type: Boolean, required: true, default: false },
    date: Date,
    author: String,
    characterCount: { type: Number, min: 100 },
    categories: {
      type: [
        {
          type: String,
          enum: CATEGORIES
        }
      ]
    },
    passages: {
      type: [
        {
          metadata: {
            type: {
              date: Date,
              author: String,
              name: { type: String, required: true },
              source: { type: String, required: true }
            }
          },
          startIdx: { type: Number, required: true, min: 0 },
          endIdx: { type: Number, required: true },
          value: { type: String, required: true },
          isEnriched: Boolean,
          tagged: {
            type: [
              [
                {
                  value: { type: String, required: true },
                  tag: String,
                  isFocusWord: Boolean,
                  isPunctuation: Boolean,
                  isConnector: Boolean,
                  isUnfocused: Boolean, // ie. don't make questions using this word
                  wordId: Schema.Types.ObjectId,
                  choiceSetId: Schema.Types.ObjectId,
                  entity: {
                    type: String,
                    enum: ENTITIES
                  }
                }
              ]
            ],
            required: true
          }
        }
      ],
      default: []
    },
    passagesCount: { type: Number, required: true, min: 0, default: 0 },
    unenrichedPassagesCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  { timestamps: { createdAt: "created_at" } }
)

textSchema.statics.redHerrings = async function(attr, not) {
  const filter = {}
  filter[attr] = { $ne: not }
  const fieldsToReturn = {}
  fieldsToReturn[attr] = 1
  return (await this.find(filter, fieldsToReturn)).map(d => d[attr])
}

textSchema.pre("save", function(next) {
  this.passagesCount = this.passages.length
  this.unenrichedPassagesCount = this.passages.filter(p => !p.isEnriched).length
  next()
})

const Model = mongoose.model("Text", textSchema)
module.exports = Model
