const _ = require("underscore")
const axios = require("axios")
const get = require("lodash/get")

const CONFIG = require("../lib/config")

const getSenses = apiResult =>
  apiResult.data.results[0].lexicalEntries[0].entries[0].senses

const parseDefinition = res => {
  const obj = getSenses(res)[0]
  const definition = obj.definitions[0]
  const tags = (obj.domains || []).map(str => str.toLowerCase())
  const thesaurusLink =
    get(obj.thesaurusLinks, "length") && obj.thesaurusLinks[0].sense_id
  return { definition, tags, thesaurusLink }
}

// TODO - fix now it has lcd
const getLemmas = async value =>
  await axios
    .get(CONFIG.DISCOVER_API_URL + "lemmas?word=" + value)
    .then(async res => res.error || res.data.lemmas)
    .catch(error => {
      console.log(error.message)
      return {}
    })

// TODO: - clean lemmas in response, fetching more
exports.enrich = async value => {
  const lemmas = await getLemmas(value)

  const definitionEndpoint = CONFIG.OXFORD_DICT_URL + "entries/en/" + value
  const thesaurusEndpoint = definitionEndpoint + "/synonyms"

  const app_id = CONFIG.OXFORD_DICTIONARIES_API_ID
  const app_key = CONFIG.OXFORD_DICTIONARIES_API_KEY
  const headers = { app_id, app_key }

  return await axios
    .get(definitionEndpoint, { headers })
    .then(async res => {
      const { definition, tags, thesaurusLink } = parseDefinition(res)

      if (!thesaurusLink) {
        return { definition, tags, lemmas }
      }

      return await axios
        .get(thesaurusEndpoint, { headers })
        .then(res2 => {
          const link = _.find(getSenses(res2), s => s.id === thesaurusLink)
          const synonyms = (link && link.synonyms.map(s => s.text)) || []
          return { definition, tags, synonyms, lemmas }
        })
        .catch(error => {
          console.log(error.message)
          return { definition, tags, lemmas }
        })
    })
    .catch(error => {
      console.log(error.message)
      return { lemmas }
    })
}
