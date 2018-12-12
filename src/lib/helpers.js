const { sample, uniq } = require("lodash")

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

exports.isPunc = char =>
  char !== undefined && [".", ",", ")", "'", '"'].indexOf(char) > -1

exports.condensed = (arr, attrs) => {
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

exports.condenseInteractive = prompt => condensed(prompt, ["correct"])
exports.condensePrompt = prompt => condensed(prompt, ["highlight", "hide"])

exports.indicesInString = (source, find) => {
  const result = []
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) === find) {
      result.push(i)
    }
  }
  return result
}

exports.qForExp = (pool, user, ids) => {
  const questions = []
  for (const id of ids) {
    const selection = pool.filter(q => q.sources.word.id.equals(id))
    if (selection.length === 0) {
      continue
    }
    const difficulties = selection.map(s => s.difficulty)
    const word = user.words.find(word => word.id.equals(id))
    const difficulty = word
      ? Math.max(...difficulties.filter(d => d <= Math.max(1, word.experience)))
      : Math.min(...difficulties)
    questions.push(sample(selection.filter(s => s.difficulty === difficulty)))
  }
  return questions
}

exports.consecutiveGroups = arr =>
  arr.sort().reduce((r, n) => {
    const lastSubArray = r[r.length - 1]

    if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
      r.push([])
    }

    r[r.length - 1].push(n)

    return r
  }, [])
