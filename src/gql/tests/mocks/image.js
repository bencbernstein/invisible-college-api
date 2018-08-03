const fs = require("fs")
const _ = require("underscore")

const mongoose = require("mongoose")

const ID = mongoose.Types.ObjectId()
const ID2 = mongoose.Types.ObjectId()

const image = {
  _id: ID,
  caption: "a sleepy place",
  location: "My bedroom",
  buf: fs.readFileSync(__dirname + "/images/nebula.jpg"),
  words: [ID2]
}

const imageBuffers = [
  fs.readFileSync(__dirname + "/images/bridge.jpg"),
  fs.readFileSync(__dirname + "/images/building.jpg"),
  fs.readFileSync(__dirname + "/images/trex.jpg"),
  fs.readFileSync(__dirname + "/images/plant.jpg"),
  fs.readFileSync(__dirname + "/images/lion.jpg")
]

const images = _.range(0, 5).map(n => ({
  _id: mongoose.Types.ObjectId(),
  buf: imageBuffers[n]
}))

module.exports = {
  mock: image,
  mocks: images.concat(image)
}
