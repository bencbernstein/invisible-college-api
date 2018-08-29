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
      _id: ID2,
      startIdx: 5,
      endIdx: 8,
      value: "I am the first sentence. I am a carnivore.",
      tagged: [
        [
          { value: "I", tag: "NN" },
          { value: "is", tag: "VB", isFocusWord: true, isConnector: true },
          { value: "a", tag: "DT" },
          {
            value: "gas",
            tag: "NN",
            isFocusWord: true,
            choiceSetId: require("./choiceSet").PHYSICAL_STATES_ID
          },
          { value: ".", isPunctuation: true }
        ],
        [
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
  passages: []
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
