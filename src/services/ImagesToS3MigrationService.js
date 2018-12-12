const AWS = require("aws-sdk")
const uuidv4 = require("uuid/v4")

const ImageModel = require("../models/image")
const CONFIG = require("../lib/config")
require("../lib/db")()

const IdentityPoolId = CONFIG.AWS_IDENTITY_POOL_ID
const Bucket = CONFIG.AWS_IMAGES_BUCKET

AWS.config.region = CONFIG.AWS_REGION
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId })
const s3 = new AWS.S3()

const uploadImageToS3 = (Body, Key) => {
  const ContentEncoding = "base64"
  const ContentType = "image/jpeg"
  const params = { Bucket, Key, Body, ContentEncoding, ContentType }
  console.log(params)
  return s3.putObject(params).promise()
}

const run = async () => {
  try {
    let skip = 0
    const limit = 25

    while (true) {
      const images = await ImageModel.find()
        .skip(skip)
        .limit(limit)

      console.log("uploading " + images.length + " images")

      for (const image of images) {
        const Key = uuidv4() + ".jpg"
        image.url = Bucket + "/" + Key
        await uploadImageToS3(image.buf, Key)
        await image.save()
      }

      if (images.length < limit) {
        break
      }

      skip += limit
    }

    console.log("DONE")
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

run()
