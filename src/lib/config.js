require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI:
    "mongodb://heroku_mw9ffrnp:gu2039fjju324omeufcnpul9f4@ds233531.mlab.com:33531/heroku_mw9ffrnp" ||
    "mongodb://localhost:27017/invisible-college",
  OXFORD_DICTIONARIES_API_ID: process.env.OXFORD_DICTIONARIES_API_ID,
  REDIS_URL: process.env.REDISTOGO_URL,
  DISCOVER_API_URL: "https://discover9292.herokuapp.com/",
  OXFORD_DICTIONARIES_API_KEY: process.env.OXFORD_DICTIONARIES_API_KEY,
  OXFORD_DICT_URL: "https://od-api.oxforddictionaries.com/api/v1/"
}
