const S = require('./controllers/sudoku-solver.js');
const s = new S();
const p = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
console.log('validate ->', s.validate(p));
console.log('solve ->', s.solve(p));
