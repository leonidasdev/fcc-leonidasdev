const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testThreadId;
  let testThreadId2;
  let testReplyId;

  test('Creating a new thread: POST /api/threads/{board}', function(done) {
    chai.request(server)
      .post('/api/threads/testboard')
      .type('form')
      .send({ text: 'Test thread', delete_password: 'pass' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.equal(res.body.text, 'Test thread');
        testThreadId = res.body._id;
        done();
      });
  });

  test('Viewing the 10 most recent threads with 3 replies each: GET /api/threads/{board}', function(done) {
    chai.request(server)
      .get('/api/threads/testboard')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        const t = res.body.find(x => x._id === testThreadId);
        assert.exists(t);
        assert.property(t, 'replies');
        done();
      });
  });

  test('Reporting a thread: PUT /api/threads/{board}', function(done) {
    chai.request(server)
      .put('/api/threads/testboard')
      .send({ thread_id: testThreadId })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        done();
      });
  });

  test('Deleting a thread with the incorrect password: DELETE /api/threads/{board}', function(done) {
    chai.request(server)
      .delete('/api/threads/testboard')
      .send({ thread_id: testThreadId, delete_password: 'wrong' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  test('Deleting a thread with the correct password: DELETE /api/threads/{board}', function(done) {
    chai.request(server)
      .delete('/api/threads/testboard')
      .send({ thread_id: testThreadId, delete_password: 'pass' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      });
  });

  test('Creating a new thread for replies', function(done) {
    chai.request(server)
      .post('/api/threads/testboard')
      .type('form')
      .send({ text: 'Thread for replies', delete_password: 'pass2' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        testThreadId2 = res.body._id;
        done();
      });
  });

  test('Creating a new reply: POST /api/replies/{board}', function(done) {
    chai.request(server)
      .post('/api/replies/testboard')
      .type('form')
      .send({ thread_id: testThreadId2, text: 'A reply', delete_password: 'rpass' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        testReplyId = res.body._id;
        done();
      });
  });

  test('Viewing a single thread with all replies: GET /api/replies/{board}', function(done) {
    chai.request(server)
      .get('/api/replies/testboard')
      .query({ thread_id: testThreadId2 })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'replies');
        const reply = res.body.replies.find(r => r._id === testReplyId);
        assert.exists(reply);
        done();
      });
  });

  test('Deleting a reply with the incorrect password: DELETE /api/replies/{board}', function(done) {
    chai.request(server)
      .delete('/api/replies/testboard')
      .send({ thread_id: testThreadId2, reply_id: testReplyId, delete_password: 'wrong' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  test('Deleting a reply with the correct password: DELETE /api/replies/{board}', function(done) {
    chai.request(server)
      .delete('/api/replies/testboard')
      .send({ thread_id: testThreadId2, reply_id: testReplyId, delete_password: 'rpass' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        // verify reply now marked as [deleted]
        chai.request(server)
          .get('/api/replies/testboard')
          .query({ thread_id: testThreadId2 })
          .end(function(err2, res2){
            const reply = res2.body.replies.find(r => r._id === testReplyId);
            assert.equal(reply.text, '[deleted]');
            done();
          });
      });
  });

  test('Reporting a reply: PUT /api/replies/{board}', function(done) {
    // create another reply to report
    chai.request(server)
      .post('/api/replies/testboard')
      .type('form')
      .send({ thread_id: testThreadId2, text: 'Reply to report', delete_password: 'rp' })
      .end(function(err, res){
        const rid = res.body._id;
        chai.request(server)
          .put('/api/replies/testboard')
          .send({ thread_id: testThreadId2, reply_id: rid })
          .end(function(err2, res2){
            assert.equal(res2.status, 200);
            assert.equal(res2.text, 'reported');
            done();
          });
      });
  });

});
