const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let invalidPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'
let unsolvablePuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..5..'
let solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'

suite('Unit Tests', () => {
  suite('Logic Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      assert.deepEqual(solver.validate(validPuzzle), { valid: true })
      done()
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      assert.deepEqual(solver.validate(invalidPuzzle+'0'),{ error: 'Invalid characters in puzzle' })
      done()
    })
    test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      assert.deepEqual(solver.validate(invalidPuzzle), { error: 'Expected puzzle to be 81 characters long'})
      done()
    })
    test('Logic handles a valid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(validPuzzle, 0, 0, '7'), true)
      done()
    })
    test('Logic handles an invalid row placement', (done) => {
      assert.equal(solver.checkRowPlacement(validPuzzle, 0, 0, '9'), false)
      done()
    })
    test('Logic handles a valid column placement', (done) => {
      assert.equal(solver.checkColPlacement(validPuzzle, 0, 0, '7'), true)
      done()
    })
    test('Logic handles an invalid column placement', (done) => {
      assert.equal(solver.checkColPlacement(validPuzzle, 0, 0, '6'), false)
      done()
    })
    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 0, '7'), true)
      done()
    })
    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      assert.equal(solver.checkRegionPlacement(validPuzzle, 0, 0, '2'), false)
      done()
    })
  })

  suite('Solver tests', () => {
    test('Valid puzzle strings pass the solver', (done) => {
      assert.deepEqual(solver.solve(solvedPuzzle), { solution: solvedPuzzle })
      done()
    })
    test('Invalid puzzle strings fail the solver', (done) => {
      assert.deepEqual(solver.solve(unsolvablePuzzle), { error: 'Puzzle cannot be solved' })
      done()
    })
    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
      assert.deepEqual(solver.solve(validPuzzle), { solution: solvedPuzzle })
      done()
    })
  })
});
