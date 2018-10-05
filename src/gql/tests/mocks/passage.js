const mongoose = require("mongoose")

const passage = {
  _id: mongoose.Types.ObjectId(),
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
      _id: "5b7c9046bc74da0020926647",
      value: "Hey",
      tag: "NNP"
    },
    {
      _id: "5b7c9046bc74da0020926646",
      isConnector: true,
      value: "dude",
      tag: "CC"
    },
    {
      isPunctuation: true,
      _id: "5b7c9046bc74da002092663c",
      value: ".",
      tag: "."
    }
  ],
  source: "Wikipedia",
  status: "accepted",
  filteredSentences: [0],
  title: "Carnivore",
  _id: "5b660afe9c181c0020ed7c2c",
  matchIdx: 1,
  value:
    "Clearly the building blocks of today’s science were formed two to three thousand years ago in the ancient Mediterranean region—in a preindustrial age before the dawn of Islam or Christianity, dur- ing a polytheistic, superstitious time. Magic and astrology were considered as legitimate as medicine and astronomy. "
}

const secondaryMocks = [
  {
    _id: mongoose.Types.ObjectId(),
    tagged: [
      {
        _id: "5b7c9046bc74da002092666e",
        value: "Its",
        tag: "RB"
      },
      {
        _id: "5b7c9046bc74da002092666d",
        value: "different",
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
      }
    ],
    source: "Wikipedia",
    status: "accepted",
    title: "Omnivore",
    _id: "5b660afe9c181c0020ed7c5c",
    matchIdx: 1,
    value:
      "Its different building blocks of today’s science were formed two to three thousand years ago in the ancient Mediterranean region—in a preindustrial age before the dawn of Islam or Christianity, dur- ing a polytheistic, superstitious time. Magic and astrology were considered as legitimate as medicine and astronomy. "
  },
  {
    _id: mongoose.Types.ObjectId(),
    tagged: [
      {
        _id: "5b7c9046bc74da002092666e",
        value: "Its",
        tag: "RB"
      },
      {
        _id: "5b7c9046bc74da002092666d",
        value: "really",
        tag: "DT"
      },
      {
        _id: "5b7c9046bc74da002092666c",
        value: "different",
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
      }
    ],
    source: "Wikipedia",
    status: "accepted",
    title: "Herbivore",
    _id: "5b660afe9c181c0020ed7c4c",
    matchIdx: 1,
    value:
      "Its really different blocks of today’s science were formed two to three thousand years ago in the ancient Mediterranean region—in a preindustrial age before the dawn of Islam or Christianity, dur- ing a polytheistic, superstitious time. Magic and astrology were considered as legitimate as medicine and astronomy. "
  }
]

module.exports = {
  mock: passage,
  mocks: secondaryMocks.concat(passage)
}
