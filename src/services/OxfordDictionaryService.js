const _ = require("underscore")
const axios = require("axios")

const CONFIG = require("../lib/config")

const getSenses = apiResult =>
  apiResult.data.results[0].lexicalEntries[0].entries[0].senses

const parseDefinition = res => {
  const obj = getSenses(res)[0]
  const definition = obj.short_definitions[0]
  const tags = (obj.domains || []).map(str => str.toLowerCase())
  const thesaurusLink =
    obj.thesaurusLinks.length && obj.thesaurusLinks[0].sense_id
  return { definition, tags, thesaurusLink }
}

exports.enrich = async value => {
  try {
    const definitionEndpoint = CONFIG.OXFORD_DICT_URL + "entries/en/" + value
    const thesaurusEndpoint = definitionEndpoint + "/synonyms"

    const app_id = CONFIG.OXFORD_DICTIONARIES_API_ID
    const app_key = CONFIG.OXFORD_DICTIONARIES_API_KEY
    const headers = { app_id, app_key }

    const [res1, res2] = await axios.all([
      axios.get(definitionEndpoint, { headers }),
      axios.get(thesaurusEndpoint, { headers })
    ])

    const { definition, tags, thesaurusLink } = parseDefinition(res1)

    const link = _.find(getSenses(res2), s => s.id === thesaurusLink)
    const synonyms = (link && link.synonyms.map(s => s.text)) || []

    return { definition, synonyms, tags }
  } catch (error) {
    console.error("ERR: " + error.message)
    return { synonyms: [], tags: [] }
  }
}
