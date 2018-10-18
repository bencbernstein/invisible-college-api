const _ = require("underscore")

const partOfSpeech = require("./partOfSpeech")
const swapLemma = require("./swapLemma")
const scrambleSentence = require("./scrambleSentence")

const sentenceToTruth = require("./sentenceToTruth")
const finishTheSentence = require("./finishTheSentence")

// const passageMetaData = require("./passageMetaData")
// const scramblePassage = require("./scramblePassage")

const TextModel = require("../../../models/text")
const WordModel = require("../../../models/word")
const QuestionModel = require("../../../models/question")
const QuestionSequenceModel = require("../../../models/questionSequence")

const TYPES = {
  PART_OF_SPEECH: partOfSpeech,
  SWAP_LEMMA: swapLemma,
  SENTENCE_TO_TRUTH: sentenceToTruth
  /*FINISH_THE_SENTENCE: finishTheSentence,*/
  /*PASSAGE_METADATA: passageMetaData,*/
  /*SCRAMBLE_PASSAGE: scramblePassage,*/
  /*SCRAMBLE_SENTENCE: scrambleSentence*/
}

const makeQuestionFor = word => {
  return (
    word.isFocusWord || ((word.wordId || word.choiceSetId) && !word.isUnfocused)
  )
}

const toSentences = tags => {
  const sentences = [[]]
  let senIdx = 0
  tags.forEach(tag => {
    if (tag.isSentenceConnector) {
      senIdx += 1
      sentences.push([])
    } else {
      sentences[senIdx].push(tag)
    }
  })
  return sentences
}

const filterPassage = passage =>
  _.flatten(
    toSentences(passage.tagged).filter((s, idx) =>
      _.includes(passage.filteredSentences, idx)
    )
  )

exports.passageQuestions = async (
  passage,
  passages,
  category,
  type,
  reverse = false
) => {
  const generate = async (p, TYPE) => {
    try {
      p.tagged = filterPassage(p)
      p.focusWordIndices = p.tagged
        .map((word, i) => (makeQuestionFor(word) ? i : -1))
        .filter(i => i > -1)
      const questions = _.compact(
        _.flatten(await TYPES[TYPE](p, passages, reverse))
      )
      questions.forEach(q => (q.TYPE = q.TYPE || TYPE))
      return questions
    } catch (error) {
      console.log("\nError generating TYPE=" + TYPE + "\n" + error)
      return []
    }
  }

  let questions

  if (type) {
    questions = await generate(passage, type)
    //: Promise.all(passages.map(p => generate(p, type))))
    questions = _.shuffle(_.flatten(questions))
  } else {
    const promises = _.keys(TYPES).map(generate)
    questions = _.flatten(await Promise.all(promises))
  }

  // questions.forEach(q => {
  //   q.sources = { id: passage._id, value: passage.name }
  //   q.categories = [category]
  // })

  if (questions.length) {
    await QuestionModel.remove()
    await QuestionModel.create(questions)
    await QuestionSequenceModel.create({
      name: "dope sequence",
      questions: questions.map(q => q._id)
    })
  }

  return questions
}

exports.additionalPassageQuestions = questions => {
  const falseSentences = questions.filter(
    q => q.TYPE === "SENTENCE_TO_TRUTH" && _.isEqual(q.redHerrings, ["FALSE"])
  )
  // TODO - complete
  return []
}
