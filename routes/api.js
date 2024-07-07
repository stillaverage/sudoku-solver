'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;
      console.log(req.body)
      res.json(solver.checkCoordinateValue(puzzle, coordinate, value))
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (solver.validate(puzzle).error) {
        res.json(solver.validate(puzzle));
      } else {
        console.log(puzzle)
        let solvedPuzzle = solver.solve(puzzle);
        if (solvedPuzzle.error) {
          res.json(solvedPuzzle);
        } else {
          res.json(solvedPuzzle);
        }
      }
    });
};
