#!/usr/bin/env node
'use strict';

module.exports = {

  search: {
    get: (req, res) => {
      let data = { error: null, movies: [] };

      let title = typeof req.params.title === 'string' ? req.params.title.trim() : '';
      if (title === '') {
        data.error = { code: 400, message: 'A searchable string title must be provided.' };
      } else {
        data.movies = []; // TODO Implement.
      }

      res.status(data.error ? data.error.code || 500 : 200);
      if (req.accepts('html') || !req.accepts('json')) {
        res.render('movies-search', { data });
      } else {
        res.json(data);
      }
    }
  },

  _: {
    get: (req, res) => {
      let data = { error: null, movie: {} };

      let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
      if (isNaN(id)) {
        data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
      } else {
        data.movie = {}; // TODO Implement.
      }

      res.status(data.error ? data.error.code || 500 : 200);
      if (req.accepts('html') || !req.accepts('json')) {
        res.render('movies', { data });
      } else {
        res.json(data);
      }
    }
  }

};
