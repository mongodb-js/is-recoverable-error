"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const chai_1 = require("chai");
describe('error is recoverable', function () {
    it('recovers when input is function x () {', function () {
        chai_1.assert.equal((0, _1.default)('function x () {'), true);
    });
    it('recovers when input is [1, 2, 3].forEach((x) =>  {', function () {
        chai_1.assert.equal((0, _1.default)('[1, 2, 3].forEach((x) =>  {'), true);
    });
    it('recovers when input is db.coll.find().forEach((x) => {', function () {
        chai_1.assert.equal((0, _1.default)('db.coll.find().forEach((x) => {'), true);
    });
    it('recovers when input is db.coll.insertOne({', function () {
        chai_1.assert.equal((0, _1.default)('db.coll.insertOne({'), true);
    });
    it('recovers for an unterminated template', function () {
        chai_1.assert.equal((0, _1.default)('var x =`'), true);
    });
    it('recovers for a \r separator', function () {
        chai_1.assert.equal((0, _1.default)('var x = \r'), true);
    });
    it('recovers for an unterminated comment', function () {
        chai_1.assert.equal((0, _1.default)('var x = 6 /**'), true);
    });
    it('recovers for an unterminated string constant that uses u2028', function () {
        chai_1.assert.equal((0, _1.default)('var x =\u2028'), true);
    });
    it('recovers for an unterminated string constant that uses u2029', function () {
        chai_1.assert.equal((0, _1.default)('var x =\u2029'), true);
    });
});
describe('error is non-recoverable', function () {
    it('does not recover when input is <cat>', function () {
        chai_1.assert.equal((0, _1.default)('<cat>'), false);
    });
    it('does not when input is db.coll.find(.forEach((x) => {', function () {
        chai_1.assert.equal((0, _1.default)('db.coll.find(.forEach((x) => {'), false);
    });
    it('does not recover for a regular unterminated string constant', function () {
        chai_1.assert.equal((0, _1.default)('var x = \'unfinished string'), false);
    });
    it('does not recover for a single line unterminated comment', function () {
        chai_1.assert.equal((0, _1.default)('function x () //\n'), true);
    });
});
