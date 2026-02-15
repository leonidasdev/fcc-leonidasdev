const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	this.timeout(10000);

	let initialLikes = 0;

	test('Viewing one stock: GET /api/stock-prices/', function(done) {
		chai.request(server)
			.get('/api/stock-prices')
			.query({stock: 'GOOG'})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				const sd = res.body.stockData;
				assert.isObject(sd);
				assert.property(sd, 'stock');
				assert.property(sd, 'price');
				assert.property(sd, 'likes');
				assert.isString(sd.stock);
				assert.isNumber(sd.price);
				assert.isNumber(sd.likes);
				initialLikes = sd.likes;
				done();
			});
	});

	test('Viewing one stock and liking it: GET /api/stock-prices/', function(done) {
		chai.request(server)
			.get('/api/stock-prices')
			.query({stock: 'GOOG', like: true})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				const sd = res.body.stockData;
				assert.isObject(sd);
				assert.isNumber(sd.likes);
				assert.equal(sd.likes, initialLikes + 1);
				initialLikes = sd.likes;
				done();
			});
	});

	test('Viewing the same stock and liking it again: GET /api/stock-prices/', function(done) {
		chai.request(server)
			.get('/api/stock-prices')
			.query({stock: 'GOOG', like: true})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				const sd = res.body.stockData;
				assert.isObject(sd);
				assert.isNumber(sd.likes);
				// like should not increase when same IP likes again
				assert.equal(sd.likes, initialLikes);
				done();
			});
	});

	test('Viewing two stocks: GET /api/stock-prices/', function(done) {
		chai.request(server)
			.get('/api/stock-prices')
			.query({stock: ['GOOG', 'MSFT']})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				const sd = res.body.stockData;
				assert.isArray(sd);
				assert.lengthOf(sd, 2);
				sd.forEach(s => {
					assert.property(s, 'stock');
					assert.property(s, 'price');
					assert.property(s, 'rel_likes');
					assert.isString(s.stock);
					assert.isNumber(s.price);
					assert.isNumber(s.rel_likes);
				});
				done();
			});
	});

	test('Viewing two stocks and liking them: GET /api/stock-prices/', function(done) {
		chai.request(server)
			.get('/api/stock-prices')
			.query({stock: ['GOOG', 'MSFT'], like: true})
			.end(function(err, res) {
				assert.equal(res.status, 200);
				const sd = res.body.stockData;
				assert.isArray(sd);
				assert.lengthOf(sd, 2);
				// rel_likes should be opposite numbers
				assert.equal(sd[0].rel_likes, -sd[1].rel_likes);
				done();
			});
	});

});
