const _ = require("underscore")

const partOfSpeech = require("./partOfSpeech")
const swapLemma = require("./swapLemma")

const sentenceToTruth = require("./sentenceToTruth")
const finishTheSentence = require("./finishTheSentence")
const passageMetaData = require("./passageMetaData")
const scramblePassage = require("./scramblePassage")
const scrambleSentence = require("./scrambleSentence")

const TextModel = require("../../../models/text")
const QuestionModel = require("../../../models/question")
const QuestionSequenceModel = require("../../../models/questionSequence")

const TYPES = {
  PART_OF_SPEECH: partOfSpeech,
  SWAP_LEMMA: swapLemma,
  SENTENCE_TO_TRUTH: sentenceToTruth,
  /*FINISH_THE_SENTENCE: finishTheSentence,*/
  PASSAGE_METADATA: passageMetaData,
  SCRAMBLE_PASSAGE: scramblePassage,
  SCRAMBLE_SENTENCE: scrambleSentence
}

exports.passageQuestions = async (passage, passages, category, type) => {
  const generate = async (p, TYPE) => {
    try {
      const questions = _.compact(_.flatten(await TYPES[TYPE](p, passages)))
      questions.forEach(q => (q.TYPE = q.TYPE || TYPE))
      return questions
    } catch (error) {
      console.log("\nError generating TYPE=" + TYPE + "\n" + error)
      return []
    }
  }

  let questions

  if (type) {
    questions = false
      ? generate(passage, type)
      : await Promise.all(passages.map(p => generate(p, type)))
    questions = _.shuffle(_.flatten(questions))
  } else {
    const promises = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(promises))
  }

  // questions.forEach(q => {
  //   q.sources = { id: passage._id, value: passage.name }
  //   q.categories = [category]
  // })
  console.log(questions.length)
  questions = await QuestionModel.create(questions)
  await QuestionSequenceModel.create({
    name: "dope sequence",
    questions: questions.map(q => q._id)
  })

  return questions
}

exports.additionalPassageQuestions = questions => {
  const falseSentences = questions.filter(
    q => q.TYPE === "SENTENCE_TO_TRUTH" && _.isEqual(q.redHerrings, ["FALSE"])
  )
  // TODO - complete
  return []
}
