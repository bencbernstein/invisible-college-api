const express = require("express")
const bodyParser = require("body-parser")
const { ApolloServer, gql } = require("apollo-server-express")
const cors = require("cors")

const CONFIG = require("./lib/config")
const schema = require("./gql/schema")
const TextController = require("./controllers/text")
const mongoose = require("./lib/db/index")
const db = mongoose()

const server = new ApolloServer({ schema })

const app = express()

app.use("*", cors())

app.use("/parseText", function(req, res, next) {
  return TextController.parse(req, res, next)
})

server.applyMiddleware({ app })

app.use(bodyParser.json({ limit: "50mb" }))

if (process.env.NODE_ENV !== "test") {
  app.listen(CONFIG.PORT, () =>
    console.log("GraphQL server starting at " + CONFIG.PORT)
  )
}

module.exports = app
