const express = require("express")
const bodyParser = require("body-parser")
const { ApolloServer, gql } = require("apollo-server-express")
const cors = require("cors")

const CONFIG = require("./lib/config")
const schema = require("./gql/schema")

const TextController = require("./controllers/text")
const ImageController = require("./controllers/image")

const mongoose = require("./lib/db")
const db = mongoose()

const playground = {
  settings: {
    "editor.cursorShape": "line"
  }
}

const server = new ApolloServer({ schema, playground })

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "50mb" }))

app.use("*", cors())

app.use("/parseText", function(req, res, next) {
  return TextController.parse(req, res, next)
})

app.post("/image", function(req, res, next) {
  return ImageController.create(req, res, next)
})

app.use("/image", function(req, res, next) {
  return ImageController.parse(req, res, next)
})

server.applyMiddleware({ app })

app.listen(CONFIG.PORT, () =>
  console.log("GraphQL server starting at " + CONFIG.PORT)
)

module.exports = app
