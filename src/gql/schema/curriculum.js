const mongoose = require("mongoose")

const CurriculumModel = require("../../models/curriculum")

const curriculumTypeDefs = `
type Curriculum {
  id: ID!
  name: String
  createdOn: String
}

extend type Query {
  curricula: [Curriculum]
  curriculum(id: String!): Curriculum
}

extend type Mutation {
  createCurriculum(name: String!): Curriculum
  removeCurriculum(id: String!): Curriculum
}
`

const curriculumResolvers = {
  Query: {
    curricula() {
      return CurriculumModel.find()
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

    removeCurriculum(_, params) {
      return CurriculumModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { curriculumTypeDefs, curriculumResolvers }
