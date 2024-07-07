const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let invalidPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'
let unsolvablePuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..5..'
let solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.solution, solvedPuzzle)
          done()
        })
    })
    test('Solve a puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field missing')
          done()
        })
    })
    test('Solve a puzzle with invalid characters', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: invalidPuzzle+'0' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })
    test('Solve a puzzle with incorrect length', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })
    test('Solve a puzzle that cannot be solved', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: unsolvablePuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Puzzle cannot be solved')
          done()
        })
    })
  })

  suite('POST request to /api/check', ()  => {
    test('Check a puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { valid: true })
          done()
        })
    })
    test('Check a puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '8' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { valid: false, conflict: ['column'] })
          done()
        })
    })
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column'] })
          done()
        })
    })
    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '5' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] })
          done()
        })
    })
    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'Required field(s) missing' })
          done()
        })
    })
    test('Check a puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: invalidPuzzle+'0', coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
          done()
        })
    })
    test('Check a puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
          done()
        })
    })
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'J1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'Invalid coordinate' })
          done()
        })
    })
    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '0' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { error: 'Invalid value' })
          done()
        })
    })
  })
});

