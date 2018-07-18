const mongoose = require("../lib/db/index")
const User = require("../models/user")

let db

const closeDb = async () => db.connection.close()

const setupDb = async () => {
  db = await mongoose()
  await clearCollections()
  return
}

const clearCollections = async () => {
  await User.remove()
  return
}

module.exports = { closeDb, setupDb }
