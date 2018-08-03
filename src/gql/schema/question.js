const _ = require("underscore")

const WordModel = require("../../models/word")

const generate = require("../../services/questionGenerators/word/index")

const questionTypeDefs = `
type Sources {
  word: String
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
  TYPE: String!
  prompt: [PromptPart]!
  answer: [AnswerPart]!
  redHerrings: [String]!
  sources: Sources!
}

extend type Query {
  questionsForWord(id: ID!): [Question]
}
`

const questionResolvers = {
  Query: {
    async questionsForWord(_, params) {
      const questions = await generate(params.id)
      return questions
    }
  }
}

module.exports = { questionTypeDefs, questionResolvers }
