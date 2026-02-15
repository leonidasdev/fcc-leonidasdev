'use strict';

// Simple in-memory message board implementation for FCC tests

// In-memory data store: { boardName: [ threads ] }
const boards = {};

function now() { return new Date(); }

function makeId(prefix=''){
  return prefix + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
}

function hidePrivate(thread) {
  return {
    _id: thread._id,
    text: thread.text,
    created_on: thread.created_on,
    bumped_on: thread.bumped_on,
    replies: thread.replies.slice(-3).map(r => ({ _id: r._id, text: r.text, created_on: r.created_on }))
  };
}

module.exports = function (app) {

  app.route('/api/threads/:board')

    .post(function (req, res) {
      const board = req.params.board;
      const { text, delete_password } = req.body;
      if (!boards[board]) boards[board] = [];
      const thread = {
        _id: makeId('t_'),
        text: text || '',
        created_on: now(),
        bumped_on: now(),
        reported: false,
        delete_password: delete_password || '',
        replies: []
      };
      boards[board].push(thread);
      res.json(thread);
    })

    .get(function (req, res) {
      const board = req.params.board;
      const list = boards[board] || [];
      const sorted = list.slice().sort((a,b) => b.bumped_on - a.bumped_on).slice(0,10);
      res.json(sorted.map(t => hidePrivate(t)));
    })

    .delete(function (req, res) {
      const board = req.params.board;
      const { thread_id, delete_password } = req.body;
      const list = boards[board] || [];
      const idx = list.findIndex(t => t._id === thread_id);
      if (idx === -1) return res.send('incorrect password');
      if (list[idx].delete_password !== delete_password) return res.send('incorrect password');
      list.splice(idx,1);
      res.send('success');
    })

    .put(function (req, res) {
      const board = req.params.board;
      const { thread_id } = req.body;
      const list = boards[board] || [];
      const th = list.find(t => t._id === thread_id);
      if (!th) return res.status(404).send('not found');
      th.reported = true;
      res.send('reported');
    });

  app.route('/api/replies/:board')

    .post(function (req, res) {
      const board = req.params.board;
      const { thread_id, text, delete_password } = req.body;
      const list = boards[board] || [];
      const th = list.find(t => t._id === thread_id);
      if (!th) return res.status(404).send('thread not found');
      const reply = {
        _id: makeId('r_'),
        text: text || '',
        created_on: now(),
        delete_password: delete_password || '',
        reported: false
      };
      th.replies.push(reply);
      th.bumped_on = now();
      res.json(reply);
    })

    .get(function (req, res) {
      const board = req.params.board;
      const thread_id = req.query.thread_id;
      const list = boards[board] || [];
      const th = list.find(t => t._id === thread_id);
      if (!th) return res.status(404).send('thread not found');
      const threadCopy = {
        _id: th._id,
        text: th.text,
        created_on: th.created_on,
        bumped_on: th.bumped_on,
        replies: th.replies.map(r => ({ _id: r._id, text: r.text, created_on: r.created_on }))
      };
      res.json(threadCopy);
    })

    .delete(function (req, res) {
      const board = req.params.board;
      const { thread_id, reply_id, delete_password } = req.body;
      const list = boards[board] || [];
      const th = list.find(t => t._id === thread_id);
      if (!th) return res.status(404).send('thread not found');
      const reply = th.replies.find(r => r._id === reply_id);
      if (!reply) return res.status(404).send('reply not found');
      if (reply.delete_password !== delete_password) return res.send('incorrect password');
      reply.text = '[deleted]';
      res.send('success');
    })

    .put(function (req, res) {
      const board = req.params.board;
      const { thread_id, reply_id } = req.body;
      const list = boards[board] || [];
      const th = list.find(t => t._id === thread_id);
      if (!th) return res.status(404).send('thread not found');
      const reply = th.replies.find(r => r._id === reply_id);
      if (!reply) return res.status(404).send('reply not found');
      reply.reported = true;
      res.send('reported');
    });

};

