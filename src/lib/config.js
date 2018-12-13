require("dotenv").config()

module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/invisible-college",
  REDIS_URL: process.env.REDISTOGO_URL,
  AWS_IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID,
  AWS_REGION: process.env.AWS_REGION,
  AWS_IMAGES_BUCKET: process.env.AWS_IMAGES_BUCKET,
  ES_HOST: process.env.ES_HOST,
  ES_AUTH: process.env.ES_AUTH
}
