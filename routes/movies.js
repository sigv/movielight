#!/usr/bin/env node
'use strict';

module.exports = (db, tmdb) => {
  return {

    search: {
      get: (req, res) => {
        let data = { error: null, movies: [] };
        let reply = () => {
          res.status(data.error ? data.error.code || 500 : 200);
          if (req.accepts('html') || !req.accepts('json')) {
            res.render('movies-search', { data });
          } else {
            res.json(data);
          }
        };

        let title = typeof req.params.title === 'string' ? req.params.title.trim() : '';
        if (title === '') {
          data.error = { code: 400, message: 'A searchable string title must be provided.' };
          reply();
        } else {
          data.movies = []; // TODO Implement.
          reply();
        }
      }
    },

    _: {
      get: (req, res) => {
        let data = { error: null, movie: {} };
        let reply = () => {
          res.status(data.error ? data.error.code || 500 : 200);
          if (req.accepts('html') || !req.accepts('json')) {
            res.render('movies', { data });
          } else {
            res.json(data);
          }
        };

        let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
        if (isNaN(id)) {
          data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
          reply();
        } else {
          data.movie = {}; // TODO Implement.
          reply();
        }
      }
    }

  };
};
