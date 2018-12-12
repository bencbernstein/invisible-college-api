const AWS = require("aws-sdk")
const uuidv4 = require("uuid/v4")
const Busboy = require("busboy")
const stream = require("stream")

const CONFIG = require("../lib/config")

const ImageModel = require("../models/image")
const WordModel = require("../models/word")

const IdentityPoolId = CONFIG.AWS_IDENTITY_POOL_ID
const Bucket = CONFIG.AWS_IMAGES_BUCKET

AWS.config.region = CONFIG.AWS_REGION
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId })
const s3 = new AWS.S3()

const uploadImageToS3 = (Body, Key) => {
  const ContentEncoding = "base64"
  const ContentType = "image/jpeg"
  const params = { Bucket, Key, Body, ContentEncoding, ContentType }
  return s3.putObject(params).promise()
}

exports.create = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  const { id } = req.query
  let output = new stream.PassThrough()
  let base64 = ""

  busboy
    .on("file", async (fieldname, file, filename, encoding, mimetype) => {
      file.setEncoding("base64")
      file.on("data", data => (base64 += data))
    })
    .on("finish", async () => {
      const buf = new Buffer(base64, "base64")
      const words = [id]

      const Key = uuidv4() + ".jpg"
      const imageData = { url: Bucket + "/" + Key, words }

      await uploadImageToS3(buf, Key)

      const image = await ImageModel.create(imageData)

      WordModel.findByIdAndUpdate(
        words[0],
        {
          $push: { images: image._id }
        },
        { new: true },
        (err, word) => res.status(201).send({ image, word })
      )
    })

  req.pipe(busboy)
}
