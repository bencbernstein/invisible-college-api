const mongoose = require("mongoose")

const CurriculumModel = require("../../models/curriculum")
const QuestionModel = require("../../models/question")

const curriculumTypeDefs = `
type Curriculum {
  id: ID!
  name: String
  createdOn: String
  questionsCount: Int
  public: Boolean
}

extend type Query {
  curricula: [Curriculum]
  curriculum(id: String!): Curriculum
}

extend type Mutation {
  createCurriculum(name: String!): Curriculum
  updateCurriculum(update: String!): Curriculum
  removeCurriculum(id: String!): Curriculum
}
`

const curriculumResolvers = {
  Query: {
    async curricula() {
      const curricula = await CurriculumModel.find()
      for (const c of curricula) {
        c.questionsCount = await QuestionModel.count({ curriculumId: c._id })
      }
      return curricula
    },

    curriculum(_, params) {
      return CurriculumModel.findById(params.id)
    }
  },

  Mutation: {
    createCurriculum(_, params) {
      const createdOn = Date.now()
      return CurriculumModel.create({ ...params, createdOn })
    },

    async removeCurriculum(_, params) {
      await QuestionModel.remove({
        curriculumId: mongoose.Types.ObjectId(params.id)
      })
      return CurriculumModel.findByIdAndRemove(params.id)
    },

    updateCurriculum(_, params) {
      const update = JSON.parse(decodeURIComponent(params.update))
      return CurriculumModel.findByIdAndUpdate(update.id, update, { new: true })
    }
  }
}

module.exports = { curriculumTypeDefs, curriculumResolvers }
