require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/invisible-college",
  OXFORD_DICTIONARIES_API_ID: process.env.OXFORD_DICTIONARIES_API_ID,
  OXFORD_DICTIONARIES_API_KEY: process.env.OXFORD_DICTIONARIES_API_KEY,
  OXFORD_DICT_URL: "https://od-api.oxforddictionaries.com/api/v1/"
}
