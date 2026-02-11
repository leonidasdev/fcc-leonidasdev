const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let id1, id2;

  test('Create an issue with every field: POST /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title 1',
        issue_text: 'Text 1',
        created_by: 'Tester',
        assigned_to: 'Chai',
        status_text: 'In QA'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 1');
        assert.equal(res.body.issue_text, 'Text 1');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, 'Chai');
        assert.equal(res.body.status_text, 'In QA');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        id1 = res.body._id;
        done();
      });
  });

  test('Create an issue with only required fields: POST /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title 2',
        issue_text: 'Text 2',
        created_by: 'Tester2'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.equal(res.body.issue_title, 'Title 2');
        assert.equal(res.body.issue_text, 'Text 2');
        assert.equal(res.body.created_by, 'Tester2');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        id2 = res.body._id;
        done();
      });
  });

  test('Create an issue with missing required fields: POST /api/issues/{project}', function(done) {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: '',
        issue_text: 'No title',
        created_by: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      });
  });

  test('View issues on a project: GET /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtLeast(res.body.length, 2);
        done();
      });
  });

  test('View issues on a project with one filter: GET /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .query({ created_by: 'Tester' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(item => assert.equal(item.created_by, 'Tester'));
        done();
      });
  });

  test('View issues on a project with multiple filters: GET /api/issues/{project}', function(done) {
    chai.request(server)
      .get('/api/issues/test')
      .query({ created_by: 'Tester', open: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(item => {
          assert.equal(item.created_by, 'Tester');
          assert.isTrue(item.open);
        });
        done();
      });
  });

  test('Update one field on an issue: PUT /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: id1, issue_title: 'Updated Title' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: id1 });
        done();
      });
  });

  test('Update multiple fields on an issue: PUT /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: id1, issue_text: 'Updated text', assigned_to: 'New person' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: id1 });
        done();
      });
  });

  test('Update an issue with missing _id: PUT /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({ issue_text: 'No id' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: id1 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: id1 });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT /api/issues/{project}', function(done) {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: 'invalidid', issue_text: 'Will fail' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', _id: 'invalidid' });
        done();
      });
  });

  test('Delete an issue: DELETE /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: id2 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: id2 });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: 'notfound' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not delete', _id: 'notfound' });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE /api/issues/{project}', function(done) {
    chai.request(server)
      .delete('/api/issues/test')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });

});
