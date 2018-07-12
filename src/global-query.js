import gql from "graphql-tag"

export const addUser = gql`
  mutation addUser(email: String!, password: String!) {
    addUser(email: email, password: password) {
      id
      email
      password
    }
  }`

export const Users = gql`
  query {
    users {
      id
      email
      password
    }
  }
`

export const removeUser = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id) {
      id
      email
    }
  }
`

export const updateUser = gql`
  mutation updateUser($id: String!, email: String!) {
    updateUser(id: $id, email: email) {
      id
      email
    }
  }`
