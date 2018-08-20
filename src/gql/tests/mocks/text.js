const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()
const ID3 = mongoose.Types.ObjectId()

const text = {
  _id: ID,
  name: "About Zoology",
  source: "Harry & Peterson",
  tokenized:
    '[{"sentence":"A solar nebula partitions a volume out of a molecular cloud by gravitational collapse, which begins to spin and flatten into a circumstellar disk, and then the planets grow out of that disk with the Sun. A nebula contains gas, ice grains, and dust (including primordial nuclides).","found":[]},{"sentence":"Sed finibus erat neque, ut efficitur lectus feugiat at.","found":[]},{"sentence":"Vestibulum non massa et tortor convallis porta.","found":[]},{"sentence":"Maecenas velit sem, dignissim ornare urna sed, tempor consequat mauris.","found":[]},{"sentence":"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.","found":[]},{"sentence":"In commodo imperdiet leo eu molestie.","found":[]},{"sentence":"Quisque ultricies arcu massa, sed gravida mi euismod fringilla.","found":[]},{"sentence":"Mauris porta ullamcorper finibus.","found":[]},{"sentence":"Vestibulum sit amet porta nunc, ut malesuada nibh.","found":[]},{"sentence":"Proin quis magna pharetra, pellentesque est ultricies, porttitor dui.","found":[]},{"sentence":"Nunc euismod rhoncus urna in fermentum.","found":[]},{"sentence":"Nunc vitae massa pulvinar, tincidunt ex eu, finibus urna.","found":[]},{"sentence":"Nunc id faucibus tortor.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Duis placerat ullamcorper nulla, quis vehicula lectus tincidunt at.","found":[]},{"sentence":"Vestibulum nec arcu vitae augue imperdiet ultrices vitae vitae sapien.","found":[]},{"sentence":"Nunc fringilla purus nibh, vel eleifend metus ultrices et.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Mauris ac tincidunt nibh.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]}]',
  passagesCount: 2,
  unenrichedPassagesCount: 1,
  passages: [
    {
      _id: ID2,
      startIdx: 5,
      endIdx: 8,
      value: "blah blah",
      tagged: [],
      found: []
    },
    {
      _id: ID3,
      startIdx: 0,
      endIdx: 1,
      value:
        "A solar nebula partitions a volume out of a molecular cloud by gravitational collapse, which begins to spin and flatten into a circumstellar disk, and then the planets grow out of that disk with the Sun. A nebula contains gas, ice grains, and dust (including primordial nuclides).",
      tagged: [
        { value: "A", tag: "DT", isFocusWord: false, isPunctuation: false },
        { value: "solar", tag: "JJ", isFocusWord: false, isPunctuation: false },
        {
          value: "nebula",
          tag: "NN",
          isFocusWord: false,
          isPunctuation: false
        },
        {
          value: "partitions",
          tag: "NNS",
          isFocusWord: true,
          isPunctuation: false
        },
        { value: "a", tag: "DT", isFocusWord: false, isPunctuation: false },
        {
          value: "volume",
          tag: "NN",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: "out", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "of", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "a", tag: "DT", isFocusWord: false, isPunctuation: false },
        {
          value: "molecular",
          tag: "JJ",
          isFocusWord: true,
          isPunctuation: false
        },
        { value: "cloud", tag: "NN", isFocusWord: false, isPunctuation: false },
        { value: "by", tag: "IN", isFocusWord: false, isPunctuation: false },
        {
          value: "gravitational",
          tag: "JJ",
          isFocusWord: true,
          isPunctuation: false
        },
        {
          value: "collapse",
          tag: "NN",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: ",", tag: ",", isFocusWord: false, isPunctuation: true },
        {
          value: "which",
          tag: "WDT",
          isFocusWord: false,
          isPunctuation: false
        },
        {
          value: "begins",
          tag: "VBZ",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: "to", tag: "TO", isFocusWord: false, isPunctuation: false },
        { value: "spin", tag: "VB", isFocusWord: false, isPunctuation: false },
        { value: "and", tag: "CC", isFocusWord: false, isPunctuation: false },
        {
          value: "flatten",
          tag: "VB",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: "into", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "a", tag: "DT", isFocusWord: false, isPunctuation: false },
        {
          value: "circumstellar",
          tag: "NN",
          isFocusWord: true,
          isPunctuation: false
        },
        { value: "disk", tag: "NN", isFocusWord: false, isPunctuation: false },
        { value: ",", tag: ",", isFocusWord: false, isPunctuation: true },
        { value: "and", tag: "CC", isFocusWord: false, isPunctuation: false },
        { value: "then", tag: "RB", isFocusWord: false, isPunctuation: false },
        { value: "the", tag: "DT", isFocusWord: false, isPunctuation: false },
        {
          value: "planets",
          tag: "NNS",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: "grow", tag: "VB", isFocusWord: false, isPunctuation: false },
        { value: "out", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "of", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "that", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "disk", tag: "NN", isFocusWord: false, isPunctuation: false },
        { value: "with", tag: "IN", isFocusWord: false, isPunctuation: false },
        { value: "the", tag: "DT", isFocusWord: false, isPunctuation: false },
        { value: "Sun", tag: "NNP", isFocusWord: false, isPunctuation: false },
        { value: ".", tag: ".", isFocusWord: false, isPunctuation: true },
        { value: "A", tag: "DT", isFocusWord: false, isPunctuation: false },
        {
          value: "nebula",
          tag: "NN",
          isFocusWord: false,
          isPunctuation: false
        },
        {
          value: "contains",
          tag: "VBZ",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: "gas", tag: "NNS", isFocusWord: false, isPunctuation: false },
        { value: ",", tag: ",", isFocusWord: false, isPunctuation: true },
        { value: "ice", tag: "NN", isFocusWord: false, isPunctuation: false },
        {
          value: "grains",
          tag: "NNS",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: ",", tag: ",", isFocusWord: false, isPunctuation: true },
        { value: "and", tag: "CC", isFocusWord: false, isPunctuation: false },
        { value: "dust", tag: "NN", isFocusWord: false, isPunctuation: false },
        { value: "(", tag: "(", isFocusWord: false, isPunctuation: true },
        {
          value: "including",
          tag: "VBG",
          isFocusWord: false,
          isPunctuation: false
        },
        {
          value: "primordial",
          tag: "JJ",
          isFocusWord: true,
          isPunctuation: false
        },
        {
          value: "nuclides",
          tag: "NNS",
          isFocusWord: false,
          isPunctuation: false
        },
        { value: ")", tag: ")", isFocusWord: false, isPunctuation: true },
        { value: ".", tag: ".", isFocusWord: false, isPunctuation: true }
      ],
      found: []
    }
  ]
}

const preFilteredText = {
  _id: mongoose.Types.ObjectId(),
  name: "biped-quadruped-centipede-millipede",
  source: "multiple",
  isPreFiltered: true,
  passagesCount: 12,
  unenrichedPassagesCount: 10,
  tokenized: JSON.stringify([
    {
      sentence:
        "Passage 1%%Source: Mueller-Schwarze_D._Chemical_ecology_of_vertebrates__2006 (5114 - 5124)%%Matches: insect, millipede",
      found: []
    },
    {
      sentence:
        "The search is on for\n\nprey that might contain other dendrobatid compounds.",
      found: []
    },
    {
      sentence:
        "D. auratus from central\n\nPanama were introduced into Hawaii and after only about 30 generations, their\n\narray of alkaloids had changed, presumably because of the change in diet (Daly\n\net al ., 1992 ).",
      found: []
    },
    {
      sentence: "Frogs of the genus Dendrobates are ant specialists.",
      found: []
    },
    {
      sentence:
        "Of the more than 20 struc-\n\ntural classes of lipophilic alkaloids found in the frogs, six occur in myrmicine ants.",
      found: []
    },
    {
      sentence:
        "However, many dendrobatid alkaloids such as the batrachotoxins, histri- onicotoxins, and pumiliotoxins, have not yet been found in insects and other\n\nleaf-litter prey such as beetles and millipedes (Daly et al ., 2000 ).",
      found: []
    },
    {
      sentence:
        "The snake Lio-\n\nphis epinephelus feeds on Dendrobates and may further bioaccumulate alkaloids.",
      found: []
    },
    {
      sentence:
        "The African clawed frog, Xenopus laevis , well known as a laboratory animal, pro- duces mucus in its granular (poison) glands that affects predatory snakes.",
      found: []
    },
    {
      sentence:
        "The most common frog-eating snakes in the clawed frog\u2019s habitat are the African water snakes, Lycodonomorphus rufulus , and Lycodonomorphus laevissimus .",
      found: []
    },
    {
      sentence:
        "Experi- ments with snakes from the Cape Town area in South Africa demonstrated the potent effect of the frog\u2019s mucus.",
      found: []
    },
    {
      sentence: "%END%",
      found: []
    },
    {
      sentence: "FOO BAR",
      found: []
    }
  ])
}

module.exports = {
  mock: text,
  mocks: [text, preFilteredText]
}
