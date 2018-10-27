// require("../../../lib/db")()

const { extend } = require("underscore")

const partOfSpeech = require("./partOfSpeech")
const swapLemma = require("./swapLemma")
const sentenceToTruth = require("./sentenceToTruth")
const finishTheSentence = require("./finishTheSentence")
const swapSpelling = require("./swapSpelling")

const PassageModel = require("../../../models/passage")
const PartialSentenceModel = require("../../../models/partialSentence")
const WordModel = require("../../../models/word")
const QuestionModel = require("../../../models/question")
const QuestionSequenceModel = require("../../../models/questionSequence")

const TYPES = {
  PART_OF_SPEECH: partOfSpeech,
  SWAP_LEMMA: swapLemma,
  SWAP_SPELLING: swapSpelling,
  SENTENCE_TO_TRUTH: sentenceToTruth,
  FINISH_THE_SENTENCE: finishTheSentence
}

exports.passageQuestions = async (doc, docs, TYPE) => {
  const data = doc.questionData()
  const passage = { id: doc._id, value: doc.title }
  const sources = { passage }

  const generate = TYPE => TYPES[TYPE](data, docs, sources)

  return TYPE ? generate(TYPE) : Promise.all(Object.keys(TYPES).map(generate))
}

exports.generatePartialSentences = async () => {
  await PartialSentenceModel.remove()
  const docs = await PassageModel.find({ status: "enriched" }).limit(1)
  await Promise.all(docs.map(d => finishTheSentence(d, [], null, true)))
  process.exit(0)
}
