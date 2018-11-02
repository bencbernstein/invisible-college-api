const {
  sample,
  uniq,
  omit,
  shuffle,
  flatten,
  partition
} = require("underscore")
const mongoose = require("mongoose")

const QuestionModel = require("../../models/question")
const WordModel = require("../../models/word")
const ImageModel = require("../../models/image")
const TextModel = require("../../models/text")
const PassageModel = require("../../models/passage")
const UserModel = require("../../models/user")

const {
  wordQuestions
} = require("../../services/questionGenerators/word/index")

const generateQuestionsForText = require("../../services/questionGenerators/sentence/index")

const onboardingWords = require("../data/onboardingWords").map(
  mongoose.Types.ObjectId
)

const { qForExp } = require("../../lib/helpers")

const questionTypeDefs = `
type Source {
  id: String!
  value: String!
}

type Sources {
  word: Source
  passage: Source
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
  id: ID!
  TYPE: String!
  prompt: [PromptPart]
  answer: [AnswerPart]
  redHerrings: [String]
  passageOrWord: String!
  interactive: [InteractivePart]
  answerCount: Int
  sources: Sources!
  experience: Int
}

type QuestionTypeCount {
  type: String!
  count: Int!
}

extend type Query {
  question(id: ID!): Question
  questionsForWord(id: ID!): [Question]
  questionsForText(id: ID!): [Question]
  questions(questionType: String, after: String): [Question]
  questionsForUser(id: ID!): String!
  questionsForType(type: String!): String!
  questionTypeCounts: [QuestionTypeCount]
}

extend type Mutation {
  saveQuestionsForUser(id: ID!, questions: String!): User
  userSawFactoid(userId: ID!, id: ID!): Boolean
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

    async questionTypeCounts(_, params) {
      const questions = (await QuestionModel.find({}, { _id: 0, TYPE: 1 })).map(
        ({ TYPE }) => TYPE
      )
      return uniq(questions).map(type => ({
        type,
        count: questions.filter(TYPE => TYPE === type).length
      }))
    },

    async questionsForText(_, params) {
      const questions = await generateQuestionsForText(params.id)
      return questions
    },

    async questionsForType(_, params) {
      const TYPE = decodeURI(params.type)
      const questions = await QuestionModel.aggregate([
        { $match: { TYPE } },
        { $sample: { size: 5 } }
      ])
      return JSON.stringify(questions)
    },

    async questionsForUser(_, params) {
      const user = await UserModel.findById(params.id)
      if (!user) throw new Error("User not found.")
      // Get id and filtered word ids for next unseen passage
      const { id, wordIds } = await PassageModel.sourcesForNextUnseen(user)
      // Get passage and word questions
      const query = { "sources.passage.id": id }
      const passageQ = await QuestionModel.findOne(query).sort("difficulty")
      const wordsQuery = { "sources.word.id": { $in: wordIds } }
      const wordQs = qForExp(
        await QuestionModel.find(wordsQuery).sort("difficulty"),
        user,
        wordIds
      )
      // Add shares root daisy chaining to each question
      const promises = wordQs.map(q => QuestionModel.createDaisyChain(q, user))
      const daisyChain = flatten(await Promise.all(promises))
      // Add experience, image / passage on correct to each question
      const gameElements = []
      for (const question of daisyChain) {
        const type = question.passageOrWord === "word" ? "word" : "passage"
        const id = question.sources[type].id
        const doc = user[`${type}s`].find(e => e.id.equals(id))
        const experience = doc ? doc.experience : undefined
        question.experience = experience
        gameElements.push(question)

        const imageOnCorrect = await question.imageOnCorrect()
        if (imageOnCorrect) {
          gameElements.push(imageOnCorrect)
        } else if (Math.random() > 0.5) {
          const passageOnCorrect = await question.passageOnCorrect()
          if (passageOnCorrect) {
            gameElements.push(passageOnCorrect)
          }
        }
      }

      gameElements.push(passageQ)
      return JSON.stringify(gameElements)
    }
  },

  Mutation: {
    async saveQuestionsForUser(_, params) {
      const user = await UserModel.findById(params.id)
      if (!user) throw new Error("User not found.")

      const decoded = JSON.parse(decodeURIComponent(params.questions))
      decoded.forEach(question => {
        const { id, value, correct, type } = question
        const correctCount = correct ? 1 : 0
        const attr = type === "word" ? "words" : "passages"
        const obj = user[attr].find(o => o.id.equals(id))
        if (obj) {
          obj.seenCount++
          obj.correctCount += correctCount
          obj.experience += correctCount
          obj.experience = Math.min(obj.experience, 10)
        } else {
          const seenCount = 1
          const experience = correctCount
          const newObj = { id, value, seenCount, correctCount, experience }
          user[attr].push(newObj)
        }
      })

      return user.save()
    },

    async userSawFactoid(_, params) {
      const { userId, id } = params
      const user = await UserModel.findById(userId)
      if (!user) throw new Error("User not found.")

      const passageIsUnseen = user.passages.map(p => p.id).indexOf(id) === -1

      if (passageIsUnseen) {
        user.passages.push({ id })
        await user.save()
      }

      return true
    }
  }
}

module.exports = { questionTypeDefs, questionResolvers }
