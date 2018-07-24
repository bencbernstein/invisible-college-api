const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const text = {
  _id: ID,
  name: "About Zoology",
  source: "Harry & Peterson",
  tokenized:
    '[{"sentence":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.","found":[]},{"sentence":"Sed finibus erat neque, ut efficitur lectus feugiat at.","found":[]},{"sentence":"Vestibulum non massa et tortor convallis porta.","found":[]},{"sentence":"Maecenas velit sem, dignissim ornare urna sed, tempor consequat mauris.","found":[]},{"sentence":"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.","found":[]},{"sentence":"In commodo imperdiet leo eu molestie.","found":[]},{"sentence":"Quisque ultricies arcu massa, sed gravida mi euismod fringilla.","found":[]},{"sentence":"Mauris porta ullamcorper finibus.","found":[]},{"sentence":"Vestibulum sit amet porta nunc, ut malesuada nibh.","found":[]},{"sentence":"Proin quis magna pharetra, pellentesque est ultricies, porttitor dui.","found":[]},{"sentence":"Nunc euismod rhoncus urna in fermentum.","found":[]},{"sentence":"Nunc vitae massa pulvinar, tincidunt ex eu, finibus urna.","found":[]},{"sentence":"Nunc id faucibus tortor.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Duis placerat ullamcorper nulla, quis vehicula lectus tincidunt at.","found":[]},{"sentence":"Vestibulum nec arcu vitae augue imperdiet ultrices vitae vitae sapien.","found":[]},{"sentence":"Nunc fringilla purus nibh, vel eleifend metus ultrices et.","found":[]},{"sentence":"Aliquam erat volutpat.","found":[]},{"sentence":"Mauris ac tincidunt nibh.","found":[]},{"sentence":"Cras fringilla finibus tellus, blandit viverra quam iaculis in.","found":[]}]',
  passages: [
    {
      _id: ID2,
      startIdx: 3,
      endIdx: 4,
      passage: "blah",
      found: []
    }
  ]
}

module.exports = {
  mock: text,
  mocks: [text]
}
