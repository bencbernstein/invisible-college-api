const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const text = {
  _id: ID,
  name: "About Zoology",
  source: "Harry & Peterson",
  tokenized:
    '[{"sentence":"A solar nebula partitions a volume out of a molecular cloud by gravitational collapse, which begins to spin and flatten into a circumstellar disk, and then the planets grow out of that disk with the Sun. A nebula contains gas, ice grains, and dust (including primordial nuclides).","found":[]},{"sentence":"Sed finibus erat neque, ut efficitur lectus feugiat at.","found":[]},{"sentence":"Vestibulum non massa et tortor convallis porta.","found":[]},{"sentence":"Maecenas velit sem, dignissim ornare urna sed, tempor consequat mauris.","found":[]},{"sentence":"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.","found":[]},{"sentence":"In commodo imperdiet leo eu molestie.","found":[]},{"sentence":"Quisque ultricies arcu massa, sed gravida mi euismod fringilla.","found":[]},{"sentence":"Mauris porta ullamcorper finibus.","found":[]},{"sentence":"Vestibulum sit amet porta nunc, ut malesuada nibh.","found":[]},{"sentence":"Proin quis magna pharetra, pellentesque est ultricies, porttitor dui.","found":[]},{"sentence":"Nunc euismod rhoncus urna in fermentum.","found":[]},{"sentence":"Nunc vitae massa pulvinar, tincidunt ex eu, finibus urna.","found":[]},{"sentence":"Nunc id faucibus tortor.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Duis placerat ullamcorper nulla, quis vehicula lectus tincidunt at.","found":[]},{"sentence":"Vestibulum nec arcu vitae augue imperdiet ultrices vitae vitae sapien.","found":[]},{"sentence":"Nunc fringilla purus nibh, vel eleifend metus ultrices et.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Mauris ac tincidunt nibh.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]}]',
  passages: [
    {
      _id: ID2,
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

module.exports = {
  mock: text,
  mocks: [text]
}
