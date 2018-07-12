const CONFIG = require("../config")
const mongoose = require("mongoose")

module.exports = function() {
  mongoose.Promise = global.Promise
  var db = mongoose.connect(CONFIG.MONGODB_URI)
  mongoose.connection
    .on("error", function(err) {
      console.log(
        "Error: Could not connect to MongoDB. Did you forget to run `mongod`?"
          .red
      )
    })
    .on("open", function() {
      console.log("Connection extablised with MongoDB")
    })
  return db
}
