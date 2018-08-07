const _ = require("underscore")

const QuestionModel = require("../../models/question")
const WordModel = require("../../models/word")
const TextModel = require("../../models/text")

const generateQuestionsForWord = require("../../services/questionGenerators/word/index")
const generateQuestionsForText = require("../../services/questionGenerators/sentence/index")

const questionTypeDefs = `
type Source {
  value: String
  id: String
}

type Sources {
  word: Source
  text: Source
}

type PromptPart {
  value: String!
  highlight: Boolean!
}

type AnswerPart {
  value: String!
  prefill: Boolean!  
}

type Question {
  id: ID
  TYPE: String!
  prompt: [PromptPart]!
  answer: [AnswerPart]!
  redHerrings: [String]!
  sources: Sources!
}

extend type Query {
  questionsForWord(id: ID!): [Question]
  questionsForText(id: ID!): [Question]
  questions(questionType: String, after: String): [Question]
}
`

const questionResolvers = {
  Query: {
    async questions(_, params) {
      const query = {}
      if (params.after) {
        query._id = { $gt: params.after }
      }
      if (params.questionType) {
        query.TYPE = params.questionType
      }
      return QuestionModel.find(query)
        .limit(20)
        .sort("_id")
    },

    async questionsForWord(_, params) {
      const questions = await generateQuestionsForWord(params.id)
      return questions
    },

    async questionsForText(_, params) {
      const questions = await generateQuestionsForText(params.id)
      return questions
    }
  }
}

module.exports = { questionTypeDefs, questionResolvers }
