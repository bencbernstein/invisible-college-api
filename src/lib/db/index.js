const CONFIG = require("../config")
const mongoose = require("mongoose")

console.log(CONFIG.MONGODB_URI)

module.exports = function() {
  mongoose.Promise = global.Promise
  var db = mongoose.connect(
    "mongodb://heroku_mw9ffrnp:gu2039fjju324omeufcnpul9f4@ds233531.mlab.com:33531/heroku_mw9ffrnp" /*CONFIG.MONGODB_URI*/,
    { useNewUrlParser: true }
  )
  mongoose.connection
    .on("error", () =>
      console.log(
        "Error: Could not connect to MongoDB. Did you forget to run `mongod`?"
          .red
      )
    )
    .on("open", () => console.log("Connection with MongoDB establised"))
    .on("close", () => console.log("Connection with MongoDB closed"))
  return db
}
