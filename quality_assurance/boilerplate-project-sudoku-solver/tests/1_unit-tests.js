const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
	const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
	const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

	setup(() => { solver = new Solver(); });

	test('Logic handles a valid puzzle string of 81 characters', function() {
		assert.strictEqual(solver.validate(validPuzzle), true);
	});

	test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
		const bad = validPuzzle.replace('.', 'a');
		assert.strictEqual(solver.validate(bad), 'Invalid characters in puzzle');
	});

	test('Logic handles a puzzle string that is not 81 characters in length', function() {
		assert.strictEqual(solver.validate(validPuzzle.slice(0, 80)), 'Expected puzzle to be 81 characters long');
	});

	test('Logic handles a valid row placement', function() {
		// pick a row and find a digit not present
		const rowIndex = 0;
		const row = validPuzzle.slice(rowIndex*9, rowIndex*9+9).split('');
		let candidate;
		for (let d = 1; d <= 9; d++) if (!row.includes(String(d))) { candidate = String(d); break; }
		assert.isTrue(solver.checkRowPlacement(validPuzzle, 'A', 2, candidate));
	});

	test('Logic handles an invalid row placement', function() {
		// pick a digit that is in the first row
		const row = validPuzzle.slice(0,9).split('');
		const present = row.find(ch => /[1-9]/.test(ch));
		assert.isFalse(solver.checkRowPlacement(validPuzzle, 'A', 2, present));
	});

	test('Logic handles a valid column placement', function() {
		// pick column 1 and find a digit not present
		const colIndex = 0;
		const col = [];
		for (let i = 0; i < 9; i++) col.push(validPuzzle[i*9 + colIndex]);
		let candidate;
		for (let d = 1; d <= 9; d++) if (!col.includes(String(d))) { candidate = String(d); break; }
		assert.isTrue(solver.checkColPlacement(validPuzzle, 'A', 1, candidate));
	});

	test('Logic handles an invalid column placement', function() {
	    const colIndex = 0;
	    const col = [];
	    for (let i = 0; i < 9; i++) col.push(validPuzzle[i*9 + colIndex]);
	    const present = col.find((ch, idx) => /[1-9]/.test(ch) && idx !== 0);
	    assert.isFalse(solver.checkColPlacement(validPuzzle, 'A', 1, present));
	});

	test('Logic handles a valid region (3x3 grid) placement', function() {
		// top-left region (A1..C3)
		const region = [];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) region.push(validPuzzle[i*9 + j]);
		let candidate;
		for (let d = 1; d <= 9; d++) if (!region.includes(String(d))) { candidate = String(d); break; }
		assert.isTrue(solver.checkRegionPlacement(validPuzzle, 'A', 1, candidate));
	});

	test('Logic handles an invalid region (3x3 grid) placement', function() {
		const region = [];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) region.push(validPuzzle[i*9 + j]);
		const present = region.find((ch, idx) => /[1-9]/.test(ch) && idx !== 0);
		assert.isFalse(solver.checkRegionPlacement(validPuzzle, 'A', 1, present));
	});

	test('Valid puzzle strings pass the solver', function() {
		const sol = solver.solve(validPuzzle);
		assert.isString(sol);
		assert.strictEqual(sol, validSolution);
	});

	test('Invalid puzzle strings fail the solver', function() {
		assert.isFalse(solver.solve(validPuzzle.replace('.', 'z')));
	});

	test('Solver returns the expected solution for an incomplete puzzle', function() {
		const sol = solver.solve(validPuzzle);
		assert.strictEqual(sol, validSolution);
	});
});

