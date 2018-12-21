require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI:
    "mongodb://heroku_mw9ffrnp:gu2039fjju324omeufcnpul9f4@ds233531.mlab.com:33531/heroku_mw9ffrnp" /*process.env.MONGODB_URI*/ ||
    "mongodb://localhost:27017/invisible-college",
  REDIS_URL: process.env.REDISTOGO_URL,
  AWS_IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID,
  AWS_REGION: process.env.AWS_REGION,
  AWS_IMAGES_BUCKET: process.env.AWS_IMAGES_BUCKET,
  ES_HOST: process.env.ES_HOST,
  ES_AUTH: process.env.ES_AUTH
}
