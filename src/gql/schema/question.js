const { sample } = require("underscore")
const mongoose = require("mongoose")

const QuestionModel = require("../../models/question")
const WordModel = require("../../models/word")
const TextModel = require("../../models/text")
const UserModel = require("../../models/user")

const {
  wordQuestions
} = require("../../services/questionGenerators/word/index")
const generateQuestionsForText = require("../../services/questionGenerators/sentence/index")

const onboardingWords = require("../data/onboardingWords")

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
  value: String
  highlight: Boolean
  hide: Boolean
  isSentenceConnector: Boolean  
}

type AnswerPart {
  value: String
  prefill: Boolean
  isSentenceConnector: Boolean
}

type InteractivePart {
  value: String
  correct: Boolean
}

type Question {
  id: ID
  TYPE: String!
  prompt: [PromptPart]
  answer: [AnswerPart]
  redHerrings: [String]
  interactive: [InteractivePart]
  answerCount: Int
  sources: Sources
  experience: Int
}

extend type Query {
  question(id: ID!): Question
  questionsForWord(id: ID!): [Question]
  questionsForText(id: ID!): [Question]
  questionsForUser(id: ID!): [Question]
  questions(questionType: String, after: String): [Question]
}
`

const questionResolvers = {
  Query: {
    async question(_, params) {
      return QuestionModel.findById(params.id)
    },

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

    questionsForWord(_, params) {
      return wordQuestions(params.id)
    },

    async questionsForText(_, params) {
      const questions = await generateQuestionsForText(params.id)
      return questions
    },

    async questionsForUser(_, params) {
      const attrs = { words: 1, passages: 1, _id: 0 }
      const user = await UserModel.findOne({}, attrs) // UserModel.findById(params.id)
      if (user) {
        if (user.words.length === 0) {
          // const ids = sample(onboardingWords, 5).map(mongoose.Types.ObjectId)
          // const question = await QuestionModel.find({
          //   "sources.word.id": { $in: ids }
          // })
          const questions = await unseenWordQuestions(user.words, 5)
          return questions
        }
      }

      return []
    }
  }
}

const unseenWordQuestions = (ids, count) =>
  QuestionModel.find({
    "sources.word.id": { $nin: ids },
    difficulty: { $lt: 3 }
  }).limit(count)

const seenWordQuestion = id =>
  QuestionModel.findOne({
    "sources.word.id": id,
    TYPE: sample(WORD_LADDER[1])
  })

module.exports = { questionTypeDefs, questionResolvers }
