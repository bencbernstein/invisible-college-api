const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const CARDIOGRAM_ID = mongoose.Types.ObjectId()

const word = {
  _id: ID,
  value: "nebula",
  isDecomposable: true,
  otherForms: ["nebulas"],
  synonyms: ["galaxy"],
  components: [
    {
      value: "nebul",
      isRoot: true
    },
    {
      value: "a",
      isRoot: false
    }
  ],
  definition: [
    {
      highlight: false,
      value: "a "
    },
    {
      highlight: true,
      value: " cloud"
    },
    {
      highlight: false,
      value: ", often used of large groups of stars"
    }
  ],
  obscurity: 5,
  tags: [
    {
      value: "lion",
      id: ID2,
      choiceSetIds: []
    }
  ],
  unverified: {
    definition: "a super cool unverified definition",
    synonyms: ["solar system"],
    tags: ["dwarf star", "neutron"]
  },
  images: [require("./image").mock._id]
}

const words = [
  {
    _id: ID2,
    value: "lion",
    isDecomposable: false,
    synonyms: [],
    definition: [
      {
        highlight: false,
        value: "a large African cat"
      }
    ],
    tags: [
      {
        value: "Africa"
      },
      {
        value: "food chain"
      },
      {
        value: "king"
      }
    ],
    obscurity: 5,
    images: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    value: "gamete",
    isDecomposable: true,
    synonyms: [],
    components: [
      {
        isRoot: true,
        value: "gam"
      },
      {
        isRoot: false,
        value: "ete"
      }
    ],
    definition: [
      {
        value: "a cell that joins with or ",
        highlight: false
      },
      {
        value: "marries",
        highlight: true
      },
      {
        value: " another cell during fertilization",
        highlight: false
      }
    ],
    obscurity: 5,
    images: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    value: "magnanimous",
    isDecomposable: true,
    synonyms: [],
    components: [
      {
        isRoot: true,
        value: "magn"
      },
      {
        isRoot: true,
        value: "anim"
      },
      {
        isRoot: false,
        value: "ous"
      }
    ],
    definition: [
      {
        value: "generous, having a ",
        highlight: false
      },
      {
        value: "large",
        highlight: true
      },
      {
        value: " ",
        highlight: false
      },
      {
        value: "soul",
        highlight: true
      }
    ],
    obscurity: 5,
    images: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    value: "cardio",
    isDecomposable: true,
    synonyms: [],
    components: [
      {
        isRoot: true,
        value: "cardi"
      },
      {
        isRoot: false,
        value: "o"
      }
    ],
    definition: [
      {
        value: "exercise",
        highlight: false
      }
    ],
    obscurity: 5,
    images: []
  },
  {
    _id: CARDIOGRAM_ID,
    value: "cardiogram",
    isDecomposable: true,
    synonyms: [],
    components: [
      {
        isRoot: true,
        value: "cardi"
      },
      {
        isRoot: false,
        value: "o"
      },
      {
        isRoot: true,
        value: "gram"
      }
    ],
    tags: [
      {
        value: "hospital"
      },
      {
        value: "heart"
      },
      {
        value: "recording"
      }
    ],
    definition: [
      {
        value: "a ",
        highlight: false
      },
      {
        value: "recording",
        highlight: true
      },
      {
        value: " of the activity of the ",
        highlight: false
      },
      {
        value: "heart",
        highlight: true
      }
    ],
    obscurity: 5,
    images: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    value: "keratosis",
    isDecomposable: true,
    synonyms: [],
    components: [
      {
        isRoot: true,
        value: "ker"
      },
      {
        isRoot: false,
        value: "at"
      },
      {
        isRoot: false,
        value: "osis"
      }
    ],
    definition: [
      {
        value: "a medical condition in which a hard ",
        highlight: false
      },
      {
        value: "horn",
        highlight: true
      },
      {
        value: "-like substance grows on the skin",
        highlight: false
      }
    ],
    obscurity: 5,
    images: []
  }
]

module.exports = {
  mock: word,
  mocks: words.concat(word),
  CARDIOGRAM_ID: CARDIOGRAM_ID
}
