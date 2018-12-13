const mongoose = require("mongoose")
const Schema = mongoose.Schema

/*
Access Levels:
  1 - super user, verifies all other levels
  2, 3 - requires verification and optional edits from super user

Decisions (queue items have many decisions, so that queues can be assigned to multiple users):
  indexes - for selected sentences in filter-passage
  accepted - ie. not rejected, for filter-word, filter-image
  id - points to edited doc created by access level 2, 3 users, super user reviews these docs
*/

var queueSchema = new Schema({
  entity: { type: String, enum: ["image", "word", "passage"], required: true },
  type: { type: String, enum: ["filter", "enrich"], required: true },
  accessLevel: { type: Number, enum: [1, 2, 3], default: 1, required: true },
  items: {
    type: [
      {
        id: { type: String, required: true },
        tags: [String],
        decisions: {
          type: [
            {
              indexes: [Number],
              accepted: Boolean,
              id: Schema.Types.ObjectId,
              userId: { type: Schema.Types.ObjectId, required: true },
              userAccessLevel: { type: Number, required: true }
            }
          ],
          required: true,
          default: []
        }
      }
    ]
  },
  curriculumId: { type: Schema.Types.ObjectId, required: true },
  curriculum: { type: String, required: true },
  part: { type: Number, min: 1 },
  createdOn: String,
  completed: { type: Boolean, required: true, default: false }
})

const Model = mongoose.model("Queue", queueSchema)
module.exports = Model
