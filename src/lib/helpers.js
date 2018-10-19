exports.toSentences = passage => {
  const sentences = [[]]
  let idx = 0

  passage.tagged.forEach(word => {
    if (word.isSentenceConnector) {
      idx++
      sentences[idx] = []
    } else {
      sentences[idx].push(word)
    }
  })

  return sentences
}

exports.track = (date, idx) => console.log(`${idx}: ${new Date() - date}`)
