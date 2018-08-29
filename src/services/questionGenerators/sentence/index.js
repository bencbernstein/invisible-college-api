const _ = require("underscore")

const sentenceToPoS = require("./sentenceToPoS")
const sentenceToTruth = require("./sentenceToTruth")
const finishTheSentence = require("./finishTheSentence")
const passageMetaData = require("./passageMetaData")
const scramblePassage = require("./scramblePassage")
const scrambleSentence = require("./scrambleSentence")

const TextModel = require("../../../models/text")

const TYPES = {
  SENTENCE_TO_POS: sentenceToPoS,
  SENTENCE_TO_TRUTH: sentenceToTruth,
  FINISH_THE_SENTENCE: finishTheSentence,
  PASSAGE_METADATA: passageMetaData,
  SCRAMBLE_PASSAGE: scramblePassage,
  SCRAMBLE_SENTENCE: scrambleSentence
}

exports.generateQuestionsForText = async (id, category, type) => {
  const doc = await TextModel.findById(id)

  const generate = async TYPE => {
    const questions = _.compact(_.flatten(await TYPES[TYPE](doc)))
    questions.forEach(q => (q.TYPE = q.TYPE || TYPE))
    return questions
  }

  let questions

  if (type) {
    questions = await generate(type)
  } else {
    const promises = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(promises))
  }

  questions.forEach(q => {
    q.sources = { id, value: doc.name }
    q.categories = [category]
  })

  return questions
}

exports.generateAdditionalQuestionsForText = questions => {
  const falseSentences = questions.filter(
    q => q.TYPE === "SENTENCE_TO_TRUTH" && _.isEqual(q.redHerrings, ["FALSE"])
  )
  // TODO - complete
  return []
}
