const _u = require("underscore")
const QuestionSequenceModel = require("../../models/questionSequence")
const QuestionModel = require("../../models/question")

const questionSequenceTypeDefs = `
type QuestionSequence {
  id: ID
  name: String!
  questions: [String]!
  fullQuestions: [Question]
}

extend type Query {
  questionSequences: [QuestionSequence]

  questionSequence(id: ID!): QuestionSequence
}

extend type Mutation {
  createQuestionSequence (
    name: String!
    question: String!
  ): QuestionSequence

  updateQuestionSequence (
    id: ID!
    questions: String!
  ): QuestionSequence

  removeQuestionSequence (
    id: ID!
  ): QuestionSequence  
}
`

const questionSequenceResolvers = {
  Query: {
    questionSequences() {
      return QuestionSequenceModel.find().catch(err => new Error(err))
    },

    async questionSequence(_, params) {
      const questionSequence = await QuestionSequenceModel.findById(params.id)
      const fullQuestions = await QuestionModel.find({
        _id: { $in: questionSequence.questions }
      })
      return _u.extend(questionSequence, { fullQuestions })
    }
  },
  Mutation: {
    createQuestionSequence(_, params) {
      return QuestionSequenceModel.create({
        questions: [params.question],
        name: params.name
      }).catch(err => new Error(err))
    },
    updateQuestionSequence(_, params) {
      return QuestionSequenceModel.findByIdAndUpdate(
        params.id,
        {
          $set: { questions: JSON.parse(decodeURIComponent(params.questions)) }
        },
        { new: true }
      ).catch(err => new Error(err))
    },
    removeQuestionSequence(_, params) {
      return QuestionSequenceModel.findByIdAndRemove(params.id).catch(
        err => new Error(err)
      )
    }
  }
}

module.exports = { questionSequenceTypeDefs, questionSequenceResolvers }
