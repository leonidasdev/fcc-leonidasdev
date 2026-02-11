'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body || {};
      if (puzzle === undefined || coordinate === undefined || value === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const valid = solver.validate(puzzle);
      if (valid !== true) return res.json({ error: valid });

      // validate coordinate
      if (!/^[A-I][1-9]$/i.test(coordinate)) return res.json({ error: 'Invalid coordinate' });
      if (!/^[1-9]$/.test(String(value))) return res.json({ error: 'Invalid value' });

      const row = coordinate[0].toUpperCase();
      const col = coordinate[1];

      // If the given value equals the existing value at coordinate, it's valid (unless conflicts elsewhere)
      const board = solver._stringToBoard(puzzle);
      const r = solver._rowIndex(row);
      const c = solver._colIndex(col);
      const existing = board[r][c];

      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

      // If existing equals value and there are no other conflicts, it's valid
      if (existing === String(value) && conflicts.length === 0) return res.json({ valid: true });

      if (conflicts.length === 0) return res.json({ valid: true });
      return res.json({ valid: false, conflict: conflicts });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body || {};
      if (puzzle === undefined) return res.json({ error: 'Required field missing' });
      const valid = solver.validate(puzzle);
      if (valid !== true) return res.json({ error: valid });
      const solution = solver.solve(puzzle);
      if (!solution) return res.json({ error: 'Puzzle cannot be solved' });
      return res.json({ solution });
    });
};
