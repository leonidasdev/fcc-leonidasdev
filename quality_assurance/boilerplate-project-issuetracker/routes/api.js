"use strict";

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res) {
      let project = req.params.project;

      // in-memory store: { projectName: [issues...] }
      if (!app.locals.issuesStore) app.locals.issuesStore = {};
      const store = app.locals.issuesStore;
      const list = store[project] || [];

      // apply filters from query
      const query = req.query || {};
      let results = list.filter(issue => {
        for (let k in query) {
          if (!Object.prototype.hasOwnProperty.call(issue, k)) return false;
          // convert boolean-like strings for `open`
          if (k === 'open') {
            const qv = (query[k] === 'false' || query[k] === false) ? false : true;
            if (issue.open !== qv) return false;
          } else {
            if (String(issue[k]) !== String(query[k])) return false;
          }
        }
        return true;
      });

      res.json(results);
    })

    .post(function (req, res) {
      let project = req.params.project;

      if (!app.locals.issuesStore) app.locals.issuesStore = {};
      const store = app.locals.issuesStore;

      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to || '';
      const status_text = req.body.status_text || '';

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const id = require('crypto').randomBytes(8).toString('hex');
      const now = new Date().toISOString();
      const issue = {
        _id: id,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: now,
        updated_on: now,
        open: true
      };

      store[project] = store[project] || [];
      store[project].push(issue);

      res.json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;

      if (!app.locals.issuesStore) app.locals.issuesStore = {};
      const store = app.locals.issuesStore;

      const _id = req.body._id;
      if (!_id) return res.json({ error: 'missing _id' });

      const updates = {};
      // any of these fields can be updated
      ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'].forEach(f => {
        if (req.body.hasOwnProperty(f) && req.body[f] !== '') updates[f] = req.body[f];
      });

      if (Object.keys(updates).length === 0) return res.json({ error: 'no update field(s) sent', _id: _id });

      const list = store[project] || [];
      const idx = list.findIndex(it => it._id === _id);
      if (idx === -1) return res.json({ error: 'could not update', _id: _id });

      const issue = list[idx];
      for (let k in updates) {
        if (k === 'open') {
          issue.open = (updates.open === 'false' || updates.open === false) ? false : true;
        } else {
          issue[k] = updates[k];
        }
      }
      issue.updated_on = new Date().toISOString();

      res.json({ result: 'successfully updated', _id: _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;

      if (!app.locals.issuesStore) app.locals.issuesStore = {};
      const store = app.locals.issuesStore;

      const _id = req.body._id;
      if (!_id) return res.json({ error: 'missing _id' });

      const list = store[project] || [];
      const idx = list.findIndex(it => it._id === _id);
      if (idx === -1) return res.json({ error: 'could not delete', _id: _id });

      list.splice(idx, 1);
      res.json({ result: 'successfully deleted', _id: _id });
    });

};
