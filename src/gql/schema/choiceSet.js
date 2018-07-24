const ChoiceSetModel = require("../../models/choiceSet")

const choiceSetTypeDefs = `
type ChoiceSet {
  id: ID!
  name: String!
  category: String
  choices: [String]!
}

extend type Query {
  choiceSets: [ChoiceSet]
}

extend type Mutation {
  addChoice (
    id: ID!
    value: String!
  ): ChoiceSet

  removeChoice (
    id: ID!
    value: String!
  ): ChoiceSet  

  removeChoiceSet (
    id: ID!
  ): ChoiceSet    
}
`

const choiceSetResolvers = {
  Query: {
    choiceSets() {
      return ChoiceSetModel.find().catch(err => new Error(err))
    }
  },
  Mutation: {
    async addChoice(_, params) {
      const conditions = {
        _id: params.id,
        choices: { $ne: params.value }
      }
      const update = { $push: { choices: params.value } }
      const updated = await ChoiceSetModel.findOneAndUpdate(
        conditions,
        update,
        { new: true }
      )
      return updated
    },
    async removeChoice(_, params) {
      return ChoiceSetModel.findByIdAndUpdate(
        params.id,
        { $pull: { choices: params.value } },
        { new: true }
      )
    },
    async removeChoiceSet(_, params) {
      return ChoiceSetModel.findByIdAndRemove(params.id)
    }
  }
}

module.exports = { choiceSetTypeDefs, choiceSetResolvers }
