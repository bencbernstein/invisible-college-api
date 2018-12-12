const redis = require("redis")
const bluebird = require("bluebird")
bluebird.promisifyAll(redis)

const REDIS_URL = require("./lib/config").REDIS_URL

let client

if (REDIS_URL) {
  const rtg = require("url").parse(REDIS_URL)
  client = redis.createClient(rtg.port, rtg.hostname)
  client.auth(rtg.auth.split(":")[1])
} else {
  client = redis.createClient()
}

client.on("connect", () =>
  console.log({ level: "info", message: "Redis connected" })
)

client.on("error", error => console.log({ level: "error", message: error }))

module.exports = client
