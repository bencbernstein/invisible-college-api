const { sample, uniq, omit, shuffle } = require("underscore")
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

type ImageOnCorrect {
  base64: String
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
      const attrs = { words: 1, passages: 1, _id: 0 }
      const user = await UserModel.findById(params.id)
      if (!user) throw new Error("User not found.")

      const seenWords = onboardingWords.slice(0, 5)
      // sample(uniq(onboardingWords), 5) concat user words

      let questions = await QuestionModel.find({
        "sources.word.id": { $in: seenWords },
        difficulty: { $lt: 3 }
      })
      questions = uniq(questions, q => q.sources.word.value)
      // questions = uniq(shuffle(questions), q => q.sources.word.value)

      const words = await WordModel.find({ _id: { $in: seenWords } })

      const gameElements = []

      for (const [idx, question] of questions.entries()) {
        gameElements.push(question)
        const word = words.find(w => w._id.equals(question.sources.word.id))

        const daisyChain = await word.daisyChain()
        if (daisyChain) {
          gameElements.push(daisyChain)
        }

        const images = await word.imageDocs()
        if (images.length) {
          const image = sample(images)
          gameElements.push({ base64: image.base64() })
        }

        const passages = await word.passageDocs("enriched")
        if (passages.length) {
          const passage = sample(passages)
          gameElements.push({ title: passage.title, value: passage.rawValue() })
        }
      }

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
