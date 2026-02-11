class SudokuSolver {

  validate(puzzleString) {
    if (typeof puzzleString !== 'string') return 'Expected puzzle to be 81 characters long';
    if (puzzleString.length !== 81) return 'Expected puzzle to be 81 characters long';
    if (/[^1-9\.]/.test(puzzleString)) return 'Invalid characters in puzzle';
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const r = this._rowIndex(row);
    const c = this._colIndex(column);
    const val = String(value);
    for (let j = 0; j < 9; j++) {
      if (j === c) continue;
      if (board[r][j] === val) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const r = this._rowIndex(row);
    const c = this._colIndex(column);
    const val = String(value);
    for (let i = 0; i < 9; i++) {
      if (i === r) continue;
      if (board[i][c] === val) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const r = this._rowIndex(row);
    const c = this._colIndex(column);
    const val = String(value);
    const sr = Math.floor(r / 3) * 3;
    const sc = Math.floor(c / 3) * 3;
    for (let i = sr; i < sr + 3; i++) {
      for (let j = sc; j < sc + 3; j++) {
        if (i === r && j === c) continue;
        if (board[i][j] === val) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const valid = this.validate(puzzleString);
    if (valid !== true) return false;
    const board = this._stringToBoard(puzzleString);

    const solveBacktrack = () => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === '.') {
            for (let d = 1; d <= 9; d++) {
              const ch = String(d);
              if (this._canPlace(board, i, j, ch)) {
                board[i][j] = ch;
                if (solveBacktrack()) return true;
                board[i][j] = '.';
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const solvable = solveBacktrack();
    if (!solvable) return false;
    return this._boardToString(board);
  }

  _canPlace(board, r, c, val) {
    // row
    for (let j = 0; j < 9; j++) if (board[r][j] === val) return false;
    // col
    for (let i = 0; i < 9; i++) if (board[i][c] === val) return false;
    // region
    const sr = Math.floor(r / 3) * 3;
    const sc = Math.floor(c / 3) * 3;
    for (let i = sr; i < sr + 3; i++) for (let j = sc; j < sc + 3; j++) if (board[i][j] === val) return false;
    return true;
  }

  // --- helpers ---
  _stringToBoard(str) {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(str.slice(i * 9, i * 9 + 9).split(''));
    }
    return board;
  }

  _boardToString(board) {
    return board.map(row => row.join('')).join('');
  }

  _rowIndex(row) {
    if (typeof row === 'number') {
      if (row > 0 && row <= 9) return row - 1; // 1-based -> 0-based
      if (row >= 0 && row < 9) return row; // already 0-based
      return row - 1; // fallback
    }
    if (typeof row === 'string' && /^[A-I]$/i.test(row)) return row.toUpperCase().charCodeAt(0) - 65;
    return parseInt(row, 10) - 1;
  }

  _colIndex(col) {
    if (typeof col === 'number') {
      if (col > 0 && col <= 9) return col - 1; // 1-based -> 0-based
      if (col >= 0 && col < 9) return col; // already 0-based
      return col - 1; // fallback
    }
    return parseInt(col, 10) - 1;
  }
}

module.exports = SudokuSolver;

