const express = require("express")
const graphqlHTTP = require("express-graphql")
const { graphql, buildSchema } = require("graphql")
const cors = require("cors")

const userSchema = require("./graphql/index").userSchema
const CONFIG = require("./lib/config")
const app = express()

const mongoose = require("./lib/db/index")
const db = mongoose()

const extensions = ({
  document,
  variables,
  operationName,
  result,
  context
}) => {
  return {
    runTime: Date.now() - (context ? context.startTime : Date.now())
  }
}

const formatError = error => ({
  message: error.message,
  locations: error.locations,
  stack: error.stack ? error.stack.split("\n") : [],
  path: error.path
})

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    context: { startTime: Date.now() },
    schema: userSchema,
    rootValue: global,
    graphiql: true,
    pretty: true,
    livereload: true,
    extensions,
    formatError
  })
)

app.use("*", cors())

app.listen(CONFIG.PORT, () =>
  console.log("GraphQL server starting at " + CONFIG.PORT)
)
