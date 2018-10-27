const toSentences = passage => {
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

const track = (date, idx) => console.log(`${idx}: ${new Date() - date}`)

const isPunc = char =>
  char !== undefined && [".", ",", ")", "'", '"'].indexOf(char) > -1

const condensed = (arr, attrs) => {
  const condensed = []

  arr.forEach(tag => {
    if (condensed.length) {
      const last = condensed[condensed.length - 1]
      let { value } = last
      const shouldCombine = attrs.every(a => last[a] === tag[a])

      if (shouldCombine) {
        value += isPunc(tag.value) ? tag.value : ` ${tag.value}`
        condensed[condensed.length - 1].value = value
        return
      }
    }

    condensed.push(tag)
  })

  return condensed
}

const condenseInteractive = prompt => condensed(prompt, ["correct"])
const condensePrompt = prompt => condensed(prompt, ["highlight", "hide"])

const indicesInString = (source, find) => {
  const result = []
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) === find) {
      result.push(i)
    }
  }
  return result
}

module.exports = {
  isPunc,
  toSentences,
  track,
  condensePrompt,
  condenseInteractive,
  indicesInString
}
