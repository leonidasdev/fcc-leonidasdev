const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
	test('convertHandler should correctly read a whole number input.', function(done) {
		assert.equal(convertHandler.getNum('32L'), 32);
		done();
	});

	test('convertHandler should correctly read a decimal number input.', function(done) {
		assert.equal(convertHandler.getNum('3.1mi'), 3.1);
		done();
	});

	test('convertHandler should correctly read a fractional input.', function(done) {
		assert.equal(convertHandler.getNum('1/2kg'), 0.5);
		done();
	});

	test('convertHandler should correctly read a fractional input with a decimal.', function(done) {
		assert.equal(convertHandler.getNum('4.5/1.5km'), 3);
		done();
	});

	test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).', function(done) {
		assert.equal(convertHandler.getNum('3/2/3kg'), 'invalid number');
		done();
	});

	test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.', function(done) {
		assert.equal(convertHandler.getNum('kg'), 1);
		done();
	});

	test('convertHandler should correctly read each valid input unit.', function(done) {
		const inputs = ['gal','l','L','mi','km','lbs','kg'];
		const expected = ['gal','L','L','mi','km','lbs','kg'];
		inputs.forEach((inp, i) => {
			assert.equal(convertHandler.getUnit('10' + inp), expected[i]);
		});
		done();
	});

	test('convertHandler should correctly return an error for an invalid input unit.', function(done) {
		assert.equal(convertHandler.getUnit('32g'), 'invalid unit');
		done();
	});

	test('convertHandler should return the correct return unit for each valid input unit.', function(done) {
		const pairs = {gal:'L', L:'gal', mi:'km', km:'mi', lbs:'kg', kg:'lbs'};
		Object.keys(pairs).forEach(k => {
			assert.equal(convertHandler.getReturnUnit(k), pairs[k]);
		});
		done();
	});

	test('convertHandler should correctly return the spelled-out string unit for each valid input unit.', function(done) {
		const pairs = {gal:'gallons', L:'liters', mi:'miles', km:'kilometers', lbs:'pounds', kg:'kilograms'};
		Object.keys(pairs).forEach(k => {
			assert.equal(convertHandler.spellOutUnit(k), pairs[k]);
		});
		done();
	});

	test('convertHandler should correctly convert gal to L.', function(done) {
		assert.approximately(convertHandler.convert(5,'gal'), 18.92705, 0.1);
		done();
	});

	test('convertHandler should correctly convert L to gal.', function(done) {
		assert.approximately(convertHandler.convert(5,'L'), 1.32086, 0.1);
		done();
	});

	test('convertHandler should correctly convert mi to km.', function(done) {
		assert.approximately(convertHandler.convert(3,'mi'), 4.82802, 0.1);
		done();
	});

	test('convertHandler should correctly convert km to mi.', function(done) {
		assert.approximately(convertHandler.convert(3,'km'), 1.86411, 0.1);
		done();
	});

	test('convertHandler should correctly convert lbs to kg.', function(done) {
		assert.approximately(convertHandler.convert(10,'lbs'), 4.53592, 0.1);
		done();
	});

	test('convertHandler should correctly convert kg to lbs.', function(done) {
		assert.approximately(convertHandler.convert(10,'kg'), 22.04624, 0.1);
		done();
	});

});