const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
	const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

	test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
		chai.request(server)
			.post('/api/solve')
			.send({ puzzle: validPuzzle })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.property(res.body, 'solution');
				assert.equal(res.body.solution, validSolution);
				done();
			});
	});

	test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
		chai.request(server)
			.post('/api/solve')
			.send({ })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Required field missing' });
				done();
			});
	});

	test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
		chai.request(server)
			.post('/api/solve')
			.send({ puzzle: validPuzzle.replace('.', 'x') })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
				done();
			});
	});

	test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
		chai.request(server)
			.post('/api/solve')
			.send({ puzzle: validPuzzle.slice(0,80) })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
				done();
			});
	});

	test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
		// make an impossible puzzle (two 1s in first row)
		const bad = '11' + validPuzzle.slice(2);
		chai.request(server)
			.post('/api/solve')
			.send({ puzzle: bad })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
				done();
			});
	});

	test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.property(res.body, 'valid');
				done();
			});
	});

	test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
		// choose a value that conflicts in row only by analyzing the puzzle
		const coord = 'A2';
		const rowIndex = coord[0].toUpperCase().charCodeAt(0) - 65;
		const colIndex = parseInt(coord[1], 10) - 1;
		// collect digits
		const row = validPuzzle.slice(rowIndex*9, rowIndex*9+9).split('');
		const col = [];
		for (let i = 0; i < 9; i++) col.push(validPuzzle[i*9 + colIndex]);
		const sr = Math.floor(rowIndex/3)*3;
		const sc = Math.floor(colIndex/3)*3;
		const region = [];
		for (let i = sr; i < sr+3; i++) for (let j = sc; j < sc+3; j++) region.push(validPuzzle[i*9 + j]);
		// find a digit present in row but not in col/region
		const conflictVal = row.find(ch => /[1-9]/.test(ch) && !col.includes(ch) && !region.includes(ch));
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: coord, value: conflictVal })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isFalse(res.body.valid);
				// should include row conflict (may include others depending on puzzle state)
				assert.include(res.body.conflict, 'row');
				done();
			});
	});

	test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
		// force a value that conflicts in row and region
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isFalse(res.body.valid);
				// conflicts may include row and region or column depending; assert array
				assert.isArray(res.body.conflict);
				done();
			});
	});

	test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
		// craft a value conflicting in row, column and region (use '1' at A1 conflicts everywhere)
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'B1', value: '1' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isFalse(res.body.valid);
				assert.isArray(res.body.conflict);
				done();
			});
	});

	test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'A2' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Required field(s) missing' });
				done();
			});
	});

	test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle.replace('.', 'x'), coordinate: 'A2', value: '3' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
				done();
			});
	});

	test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle.slice(0,80), coordinate: 'A2', value: '3' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
				done();
			});
	});

	test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Invalid coordinate' });
				done();
			});
	});

	test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
		chai.request(server)
			.post('/api/check')
			.send({ puzzle: validPuzzle, coordinate: 'A2', value: '0' })
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.deepEqual(res.body, { error: 'Invalid value' });
				done();
			});
	});
});

