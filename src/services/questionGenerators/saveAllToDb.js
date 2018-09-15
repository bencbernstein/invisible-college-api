const _ = require("underscore")
const pos = require("pos")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const QuestionSequenceModel = require("../../models/questionSequence")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")
const CONNECTORS = _.flatten(
  require("../../lib/connectors").map(c => c.elements)
)

const wordQuestions = require("./word/index")

const {
  passageQuestions,
  additionalPassageQuestions
} = require("./sentence/index")

const tag = (value, words, choiceSets) => {
  if (value === undefined) {
    console.log("UNDEFINED")
  }
  const lexed = new pos.Lexer().lex(value)
  const tagger = new pos.Tagger()
  const tagged = tagger.tag(lexed).map(t => ({ value: t[0], tag: t[1] }))

  tagged.forEach(t => {
    const isPunctuation = t.value === t.tag
    const isConnector = CONNECTORS.indexOf(t.value) > -1
    if (isPunctuation) {
      delete t.tag
      t.isPunctuation = true
    } else if (isConnector) {
      t.isConnector = true
    } else {
      const wordIdx = _.findIndex(
        words.map(w => w.otherForms.concat(w.value)),
        w => w.indexOf(t.value) > -1
      )
      if (wordIdx > -1) {
        t.wordId = words[wordIdx]._id
      }
      const choiceSetIdx = _.findIndex(
        choiceSets.map(c => c.choices),
        c => c.indexOf(t.value) > -1
      )
      if (choiceSetIdx > -1) {
        t.choiceSetId = choiceSets[choiceSetIdx]._id
      }
    }
  })

  return tagged
}

const createTextQuestions = async query => {
  const texts = await TextModel.find()
  const words = await WordModel.find({}, { value: 1, otherForms: 1 })
  const choiceSets = await ChoiceSetModel.find({}, { choices: 1 })

  const promises = texts.map(async text => {
    try {
      let tokenized = JSON.parse(text.tokenized)

      if (_.isObject(tokenized[0])) {
        tokenized = tokenized.map(elem => elem.sentence)
      }

      const isMultipleSources = text.source === "multiple"

      text.tokenized = JSON.stringify(tokenized)

      const passages = text.passages.map(passage => {
        const { startIdx, endIdx, metadata, id, isEnriched } = passage
        const sliced = _.compact(tokenized.slice(startIdx, endIdx))
        const value = sliced.join(" ")
        const tagged = _.flatten(
          sliced
            .map(s => tag(s, words, choiceSets))
            .reduce((a, v) => [...a, v, { isSentenceConnector: true }], [])
            .slice(0, -1)
        )
        const source = metadata ? metadata.source : text.source
        const data = {
          id,
          source,
          startIdx,
          endIdx,
          isEnriched,
          value,
          tagged
        }
        return data
      })

      text.passages = passages
      return await text.save()
    } catch (error) {
      console.log("ERROR")
      console.log(error.message)
      return
    }
  })

  return Promise.all(promises)
}

exports.generate = async category => {
  const query = category ? { categories: category } : {}
  await createTextQuestions(query)
  console.log("success!!!")
  process.exit(0)
}

/*const _ = require("underscore")
const pos = require("pos")

require("../../lib/db")()

const QuestionModel = require("../../models/question")
const QuestionSequenceModel = require("../../models/questionSequence")
const TextModel = require("../../models/text")
const WordModel = require("../../models/word")
const ChoiceSetModel = require("../../models/choiceSet")
const CONNECTORS = _.flatten(
  require("../../lib/connectors").map(c => c.elements)
)

const wordQuestions = require("./word/index")

const {
  passageQuestions,
  additionalPassageQuestions
} = require("./sentence/index")

const createWordQuestions = async query => {
  const docs = await WordModel.find(query)

  const promises = docs.map(
    async doc => await wordQuestions(doc, docs, query.category)
  )

  return Promise.all(promises)
}

const createTextQuestions = async query => {
  let passages = _.flatten(
    (await TextModel.find({}, { passages: 1, _id: 0 })).map(t => t.passages)
  )
  passages = _.shuffle(passages.filter(p => p.isEnriched))

  // const additionalTextQs = generateAdditionalQuestionsForText(textQs)

  return Promise.all(
    passages.map(p => passageQuestions(p, passages, query.category))
  )
}

exports.generate = async category => {
  await QuestionModel.remove()
  await QuestionSequenceModel.remove()

  const query = category ? { categories: category } : {}

  let questions = _.flatten([
    await createWordQuestions(query),
    await createTextQuestions(query)
  ])

  questions = _.shuffle(questions)
  questions.forEach(q => console.log(q.TYPE))

  try {
    questions = await QuestionModel.create(questions)
    console.log("Succesfully created " + questions.length + " questions")
    const name = "test sequence"
    questions = questions.map(q => q._id)
    await QuestionSequenceModel.create({ name, questions })
    console.log("Succesfully created " + name)
  } catch (e) {
    console.log(e)
  }

  process.exit(0)
}
*/
