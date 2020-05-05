var isRecoverableError = require('./')
var assert = require('chai').assert

describe('error is recoverable', function () {
  it('recovers when input is function x () {', function () {
    assert.equal(isRecoverableError('function x () {'), true)
  })

  it('recovers when input is [1, 2, 3].forEach((x) =>  {', function () {
    assert.equal(isRecoverableError('[1, 2, 3].forEach((x) =>  {'), true)
  })

  it('recovers when input is db.coll.find().forEach((x) => {', function () {
    assert.equal(isRecoverableError('db.coll.find().forEach((x) => {'), true)
  })

  it('recovers when input is db.coll.insertOne({', function () {
    assert.equal(isRecoverableError('db.coll.insertOne({'), true)
  })
})

describe('error is non-recoverable', function () {
  it('does not recover when input is <cat>', function () {
    assert.equal(isRecoverableError('<cat>'), false)
  })

  it('recovers when input is db.coll.find(.forEach((x) => {', function () {
    assert.equal(isRecoverableError('db.coll.find(.forEach((x) => {'), false)
  })
})
