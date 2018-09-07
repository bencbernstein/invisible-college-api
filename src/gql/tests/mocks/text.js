const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()
const ID3 = mongoose.Types.ObjectId()

const text = {
  _id: ID,
  name: "About Zoology",
  source: "Harry & Peterson",
  tokenized: JSON.stringify([
    "A solar nebulas partitions carnivore out of a molecular cloud by gravitational collapse, which begins to spin and flatten into a circumstellar disk, and then the planets grow out of that disk with the Sun.",
    "A nebula contains gas, ice grains, and dust (including primordial nuclides).",
    "Sed finibus erat neque, ut efficitur lectus feugiat at."
  ]),
  passagesCount: 2,
  unenrichedPassagesCount: 1,
  characterCount: 105,
  passages: [
    {
      tagged: [
        {
          _id: "5b7c9046bc74da002092666e",
          value: "Clearly",
          tag: "RB"
        },
        {
          _id: "5b7c9046bc74da002092666d",
          value: "the",
          tag: "DT"
        },
        {
          _id: "5b7c9046bc74da002092666c",
          value: "building",
          tag: "VBG"
        },
        {
          _id: "5b7c9046bc74da002092666b",
          value: "blocks",
          tag: "NNS"
        },
        {
          _id: "5b7c9046bc74da002092666a",
          value: "of",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da0020926669",
          value: "today’s",
          tag: "NNS"
        },
        {
          _id: "5b7c9046bc74da0020926668",
          value: "science",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926667",
          value: "were",
          tag: "VBD"
        },
        {
          _id: "5b7c9046bc74da0020926666",
          value: "formed",
          tag: "VBN"
        },
        {
          _id: "5b7c9046bc74da0020926665",
          value: "two",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926664",
          value: "to",
          tag: "TO"
        },
        {
          _id: "5b7c9046bc74da0020926663",
          value: "three",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926662",
          value: "thousand",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926661",
          value: "years",
          tag: "NNS"
        },
        {
          _id: "5b7c9046bc74da0020926660",
          value: "ago",
          tag: "RB"
        },
        {
          _id: "5b7c9046bc74da002092665f",
          value: "in",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da002092665e",
          value: "the",
          tag: "DT"
        },
        {
          _id: "5b7c9046bc74da002092665d",
          value: "ancient",
          tag: "JJ"
        },
        {
          _id: "5b7c9046bc74da002092665c",
          value: "Mediterranean",
          tag: "NNP"
        },
        {
          _id: "5b7c9046bc74da002092665b",
          value: "region—in",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da002092665a",
          value: "a",
          tag: "DT"
        },
        {
          _id: "5b7c9046bc74da0020926659",
          value: "preindustrial",
          tag: "JJ"
        },
        {
          _id: "5b7c9046bc74da0020926658",
          value: "age",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926657",
          value: "before",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da0020926656",
          value: "the",
          tag: "DT"
        },
        {
          _id: "5b7c9046bc74da0020926655",
          value: "dawn",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926654",
          value: "of",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da0020926653",
          value: "Islam",
          tag: "NNP"
        },
        {
          _id: "5b7c9046bc74da0020926652",
          value: "or",
          tag: "CC"
        },
        {
          isFocusWord: true,
          _id: "5b7c9046bc74da0020926651",
          value: "Christianity",
          tag: "NNP"
        },
        {
          isPunctuation: true,
          _id: "5b7c9046bc74da0020926650",
          value: ",",
          tag: ","
        },
        {
          _id: "5b7c9046bc74da002092664f",
          value: "during",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da002092664d",
          value: "a",
          tag: "DT"
        },
        {
          _id: "5b7c9046bc74da002092664c",
          value: "polytheistic",
          tag: "NN"
        },
        {
          isPunctuation: true,
          _id: "5b7c9046bc74da002092664b",
          value: ",",
          tag: ","
        },
        {
          _id: "5b7c9046bc74da002092664a",
          value: "superstitious",
          tag: "JJ"
        },
        {
          _id: "5b7c9046bc74da0020926649",
          value: "time",
          tag: "NN"
        },
        {
          isPunctuation: true,
          _id: "5b7c9046bc74da0020926648",
          value: ".",
          tag: "."
        },
        {
          isSentenceConnector: true
        },
        {
          _id: "5b7c9046bc74da0020926647",
          value: "Magic",
          tag: "NNP"
        },
        {
          _id: "5b7c9046bc74da0020926646",
          isConnector: true,
          value: "and",
          tag: "CC"
        },
        {
          _id: "5b7c9046bc74da0020926645",
          value: "astrology",
          tag: "NN"
        },
        {
          _id: "5b7c9046bc74da0020926644",
          value: "were",
          tag: "VBD"
        },
        {
          _id: "5b7c9046bc74da0020926643",
          value: "considered",
          tag: "VBN"
        },
        {
          _id: "5b7c9046bc74da0020926642",
          value: "as",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da0020926641",
          value: "legitimate",
          tag: "JJ"
        },
        {
          _id: "5b7c9046bc74da0020926640",
          value: "as",
          tag: "IN"
        },
        {
          _id: "5b7c9046bc74da002092663f",
          value: "gas",
          tag: "NN",
          choiceSetId: require("./choiceSet").PHYSICAL_STATES_ID
        },
        {
          _id: "5b7c9046bc74da002092663e",
          value: "and",
          tag: "CC"
        },
        {
          _id: "5b7c9046bc74da002092663d",
          value: "cardiogram",
          tag: "NN",
          wordId: require("./word").CARDIOGRAM_ID
        },
        {
          isPunctuation: true,
          _id: "5b7c9046bc74da002092663c",
          value: ".",
          tag: "."
        },
        {
          isSentenceConnector: true
        },
        {
          _id: "5b7c9046bc74da002092883d",
          value: "Hi",
          tag: "NN"
        }
      ],
      isEnriched: true,
      source: "About Zoology",
      _id: "5b660afe9c181c0020ed7c2c",
      startIdx: 35,
      endIdx: 37,
      value:
        "Clearly the building blocks of today’s science were formed two to three thousand years ago in the ancient Mediterranean region—in a preindustrial age before the dawn of Islam or Christianity, dur- ing a polytheistic, superstitious time. Magic and astrology were considered as legitimate as medicine and astronomy. "
    },
    {
      _id: ID2,
      startIdx: 5,
      endIdx: 8,
      value: "I am the first sentence. I am a carnivore.",
      isEnriched: true,
      tagged: [
        { value: "I", tag: "NN" },
        { value: "is", tag: "VB", isFocusWord: true, isConnector: true },
        { value: "a", tag: "DT" },
        {
          value: "gas",
          tag: "NN",
          isFocusWord: true,
          choiceSetId: require("./choiceSet").PHYSICAL_STATES_ID
        },
        { value: ".", isPunctuation: true },
        { value: "I", tag: "NN" },
        { value: "am", tag: "VB" },
        { value: "a", tag: "DT" },
        {
          value: "cardiogram",
          tag: "NN",
          isFocusWord: true,
          wordId: require("./word").CARDIOGRAM_ID
        },
        { value: ".", isPunctuation: true }
      ]
    }
  ]
}

const text2 = {
  _id: mongoose.Types.ObjectId(),
  name: "Anotha One",
  source: "Rick Ross",
  tokenized: "[]",
  passagesCount: 0,
  unenrichedPassagesCount: 0,
  characterCount: 200,
  passages: [
    {
      _id: mongoose.Types.ObjectId(),
      startIdx: 5,
      endIdx: 8,
      source: "A Different Source",
      value: "I luh you",
      tagged: [
        { value: "I", tag: "NN" },
        { value: "luh", tag: "VB" },
        { value: "you", tag: "DT" }
      ]
    }
  ]
}

const preFilteredText = {
  _id: mongoose.Types.ObjectId(),
  name: "biped-quadruped-centipede-millipede",
  source: "multiple",
  isPreFiltered: true,
  passagesCount: 12,
  characterCount: 500,
  unenrichedPassagesCount: 10,
  tokenized: JSON.stringify([
    "Passage 1%%Source: Mueller-Schwarze_D._Chemical_ecology_of_vertebrates__2006 (5114 - 5124)%%Matches: insect, millipede",
    "The search is on for\n\nprey that might contain other dendrobatid compounds.",
    "D. auratus from central\n\nPanama were introduced into Hawaii and after only about 30 generations, their\n\narray of alkaloids had changed, presumably because of the change in diet (Daly\n\net al ., 1992 ).",
    "Frogs of the genus Dendrobates are ant specialists.",
    "Of the more than 20 struc-\n\ntural classes of lipophilic alkaloids found in the frogs, six occur in myrmicine ants.",
    "However, many dendrobatid alkaloids such as the batrachotoxins, histri- onicotoxins, and pumiliotoxins, have not yet been found in insects and other\n\nleaf-litter prey such as beetles and millipedes (Daly et al ., 2000 ).",
    "The snake Lio-\n\nphis epinephelus feeds on Dendrobates and may further bioaccumulate alkaloids.",
    "The African clawed frog, Xenopus laevis , well known as a laboratory animal, pro- duces mucus in its granular (poison) glands that affects predatory snakes.",
    "The most common frog-eating snakes in the clawed frog\u2019s habitat are the African water snakes, Lycodonomorphus rufulus , and Lycodonomorphus laevissimus .",
    "Experi- ments with snakes from the Cape Town area in South Africa demonstrated the potent effect of the frog\u2019s mucus.",
    "%END%",
    "FOO BAR"
  ]),
  passages: []
}

module.exports = {
  mock: text,
  mocks: [text, text2, preFilteredText]
}
