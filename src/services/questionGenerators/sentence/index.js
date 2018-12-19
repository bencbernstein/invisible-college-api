const mongoose = require("mongoose")
require("../../../lib/db")()

const { flatten } = require("lodash")

const partOfSpeech = require("./partOfSpeech")
const swapLemma = require("./swapLemma")
const sentenceToTruth = require("./sentenceToTruth")
const finishTheSentence = require("./finishTheSentence")
const swapSpelling = require("./swapSpelling")

const PassageModel = require("../../../models/passage")
const WordModel = require("../../../models/word")
const QuestionModel = require("../../../models/question")
const PartialSentenceModel = require("../../../models/partialSentence")

const TYPES = {
  PART_OF_SPEECH: partOfSpeech,
  SWAP_LEMMA: swapLemma,
  SWAP_SPELLING: swapSpelling,
  SENTENCE_TO_TRUTH: sentenceToTruth
  // FINISH_THE_SENTENCE: finishTheSentence
}

exports.createPassageQuestions = async id => {
  const doc = await PassageModel.findById(id)
  if (!doc.enriched) return
  // Update Word to Passage relationships
  const wordIds = doc.tagged.map(({ wordId }) => wordId).filter(id => id)
  for (const wordId of wordIds) {
    let passages = await PassageModel.find(
      { "tagged.wordId": wordId },
      { curriculumId: 1 }
    )
    passages = passages.map(({ _id, curriculumId }) => ({
      id: _id,
      curriculumId
    }))
    let word = await WordModel.findById(wordId)
    word = await WordModel.findByIdAndUpdate(
      wordId,
      { $set: { passages } },
      { new: true }
    )
  }
  // Remove Passage Questions
  const query = { "sources.passage.id": mongoose.Types.ObjectId(id) }
  await QuestionModel.remove(query)
  // Create Passage Questions
  const questions = await passageQuestions(doc)
  await QuestionModel.create(questions)
}

const passageQuestions = async doc => {
  let TYPE //= "SWAP_SPELLING"
  const passage = { id: doc._id, value: doc.title }
  const sources = { passage }

  const generate = TYPE => TYPES[TYPE](doc, sources)
  let questions = await (TYPE
    ? generate(TYPE)
    : Promise.all(Object.keys(TYPES).map(generate)))

  questions = flatten(questions)
  questions.forEach(q => {
    q.passageOrWord = "passage"
    q.curriculumId = doc.curriculumId
  })

  return questions
}

exports.generatePartialSentences = async () => {
  await PartialSentenceModel.remove()
  const docs = await PassageModel.find({ status: "enriched" }).limit(1)
  await Promise.all(docs.map(d => finishTheSentence(d, [], null, true)))
  process.exit(0)
}

exports.passageQuestions = passageQuestions
