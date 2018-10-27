/*const { toSentences } = require("../../../lib/helpers")

module.exports = passage => {
  const sentences = toSentences(passage)

  if (sentences.length < 2) {
    return
  }

  const answer = sentences.map(words => ({
    prefill: false,
    value: words.map(w => w.value).join(" ")
  }))

  return { answer }
}
*/
