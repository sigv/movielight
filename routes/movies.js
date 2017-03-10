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
            .then(movie => {
              data.movies = movie.results.map(movie => {
                return new models.Movie(movie.id,
                  movie.title,
                  movie.original_title,
                  parseInt(movie.release_date.split('-')[0], 10),
                  movie.poster_path,
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
          tmdb.movie.details({ movie_id: id })
            .then(movie => {
              data.movie = new models.Movie(movie.id,
                movie.title,
                movie.original_title,
                parseInt(movie.release_date.split('-')[0], 10),
                movie.poster_path,
                []);
              tmdb.movie.credits({ movie_id: id })
                .then(credits => {
                  data.movie.actors = credits.cast.map(person => {
                    return new models.Person(person.id,
                      person.name,
                      [],
                      null,
                      null,
                      person.profile_path,
                      []);
                  });
                  reply();
                })
                .catch(err => {
                  console.error(err);
                  data.error = { code: 500, message: 'The upstream API did not respond as expected.' };
                  reply();
                });
            })
            .catch(err => {
              console.error(err);
              data.error = { code: 500, message: 'The upstream API did not respond as expected.' };
              reply();
            });
        }
      }
    }

  };
};
