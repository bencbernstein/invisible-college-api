const fs = require("fs")
const chai = require("chai")
const chaiHttp = require("chai-http")
const should = chai.should()
const expect = chai.expect
const server = require("../../index")

const { seedDb } = require("../../test/helpers")
const schema = require("./../schema")
const Image = require("../../models/image")

const image = require("./mocks/image").mock

chai.use(chaiHttp)

describe("images", () => {
  beforeEach(async () => await seedDb())

  it("returns 1 image with 1 image in the db", done => {
    const url = "/image" + "?action=GET"

    chai
      .request(server)
      .get(url)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("array").of.length(1)
        done()
      })
  })

  it("returns 1 image with an id", done => {
    const url = "/image" + "?action=GET&ids=" + image._id

    chai
      .request(server)
      .get(url)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("array").of.length(1)
        done()
      })
  })

  it("creates an image", done => {
    const url = "/image" + "?action=POST"

    chai
      .request(server)
      .post(url)
      .send({ buf: image.buf, words: image.words })
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.have.property("_id")
        done()
      })
  })
})
