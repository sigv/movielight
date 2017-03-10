#!/usr/bin/env node
'use strict';

module.exports = (db, tmdb, models) => {
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
          tmdb.search.movie({ query: title })
            .then(results => {
              data.movies = results.results.map(item => {
                return new models.Movie(item.id,
                  item.title,
                  item.original_title,
                  parseInt(item.release_date.split('-')[0], 10),
                  item.poster_path,
                  []);
              });
              reply();
            })
            .catch(err => {
              console.error(err);
              data.error = { code: 500, message: 'The upstream API did not respond as expected.' };
              reply();
            });
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
