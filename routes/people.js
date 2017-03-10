#!/usr/bin/env node
'use strict';

module.exports = {

  search: {
    get: (req, res) => {
      let data = { error: null, people: [] };

      let name = typeof req.params.name === 'string' ? req.params.name.trim().split('-').join(' ') : '';
      if (name === '') {
        data.error = { code: 400, message: 'A searchable string name must be provided.' };
      } else {
        data.people = []; // TODO Implement.
      }

      res.status(data.error ? data.error.code || 500 : 200);
      if (req.accepts('html') || !req.accepts('json')) {
        res.render('people-search', { data });
      } else {
        res.json(data);
      }
    }
  },

  _: {
    get: (req, res) => {
      let data = { error: null, person: {} };

      let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
      if (isNaN(id)) {
        data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
      } else {
        data.person = {}; // TODO Implement.
      }

      res.status(data.error ? data.error.code || 500 : 200);
      if (req.accepts('html') || !req.accepts('json')) {
        res.render('people', { data });
      } else {
        res.json(data);
      }
    }
  }

};
