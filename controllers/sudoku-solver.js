// const EMPTY = '.'
// const possibleNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const coordinateMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8
}

class SudokuSolver {

  checkCoordinateValue(puzzle, coordinate, value) {
    if (!puzzle || !coordinate || !value) {
      return { error: 'Required field(s) missing' }
    } else if (/[^1-9.]/g.test(puzzle)) {
      return { error: 'Invalid characters in puzzle' }
    } else if (puzzle.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long'}
    }
    if (/^[A-I][1-9]$/i.test(coordinate)) {
      let row = coordinateMap[coordinate[0]]
      let column = Number(coordinate[1]) - 1
      if (!/^[1-9]$/.test(value)) {
        return { error: 'Invalid value' }
      }
      let conflict = [];
      if (!this.checkRowPlacement(puzzle, row, column, value)) {
        conflict.push('row')
      }
      if (!this.checkColPlacement(puzzle, row, column, value)) {
        conflict.push('column')
      }
      if (!this.checkRegionPlacement(puzzle, row, column, value)) {
        conflict.push('region')
      }
      if (conflict.length === 0) {
        return { valid: true }
      } else {
        return { valid: false, conflict }
      }
    } else {
      return { error: 'Invalid coordinate' }
    }
  }

  validate(puzzle) {
    if (!puzzle) {
      return { error: 'Required field missing' }
    } else if (/[^1-9.]/g.test(puzzle)) {
      return { error: 'Invalid characters in puzzle' }
    } else if (puzzle.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long'}
    } else {
      let puzzleArray = puzzle.split('')
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          let value = puzzle[9 * row + column]
          if (value !== '.' &&
            (
            !this.checkRowPlacement(puzzleArray, row, column, value) 
            || !this.checkColPlacement(puzzleArray, row, column, value)
            || !this.checkRegionPlacement(puzzleArray, row, column, value)
            )
          ) {
            return { error: 'Puzzle cannot be solved' }
          } 
        }
      }
      return { valid: true }
    }
  }

  checkRowPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[9 * row + i] === value && i !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzle, row, column, value) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[9 * j + column] === value && j !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzle[27 * Math.floor(row / 3) + i + 9 * j + 3 * Math.floor(column / 3)] === value && i !== column % 3 && j !== row % 3) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzle) {
    let emptySpaces = [];
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (puzzle[(9 * row + column)] === '.') {
          emptySpaces.push({ row, column });
        }
      }
    }
    let puzzleArray = puzzle.split('');
    this.recursiveSolve(puzzleArray, 0, emptySpaces);

    if (puzzleArray.includes('.')) {
      return { error: 'Puzzle cannot be solved' }
    } else {
      return { solution: puzzleArray.join('') }
    }
  }

  recursiveSolve(puzzleArray, emptySpaceIndex, emptySpaces) {
    if (emptySpaceIndex >= emptySpaces.length) {
      return true;
    }
    const { row, column } = emptySpaces[emptySpaceIndex];
    for (let value = 1; value < 10; value++) {
      value = value.toString()
      if (
        this.checkRowPlacement(puzzleArray, row, column, value) 
        && this.checkColPlacement(puzzleArray, row, column, value)
        && this.checkRegionPlacement(puzzleArray, row, column, value)
      ) {
        puzzleArray[9 * row + column] = value;
        if (this.recursiveSolve(puzzleArray, emptySpaceIndex + 1, emptySpaces)) {
          return true;
        }
        puzzleArray[9 * row + column] = '.';
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;
