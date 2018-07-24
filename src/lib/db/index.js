const CONFIG = require("../config")
const mongoose = require("mongoose")

module.exports = function() {
  mongoose.Promise = global.Promise
  var db = mongoose.connect(
    CONFIG.MONGODB_URI,
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
