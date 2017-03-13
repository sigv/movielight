#!/usr/bin/env node
/* eslint-env es6, node */
'use strict';

module.exports = (db, tmdb, models) => {
  return {

    search: {
      get: (req, res) => {
        let data = { error: null, movies: [] };
        let reply = () => res.status(data.error ? data.error.code || 500 : 200).json(data);

        let title = typeof req.params.title === 'string' ? req.params.title.trim() : '';
        if (title === '') {
          data.error = { code: 400, message: 'A searchable string title must be provided.' };
          reply();
        } else {
          tmdb.search.movie({ query: title })
            .then(movie => {
              data.movies = movie.results.map(movie => new models.Movie(movie.id,
                movie.title,
                movie.original_title,
                movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : null,
                movie.overview,
                movie.poster_path));
              reply();
            })
            .catch(err => {
              console.error('TMDb: ' + err.message);
              data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
              reply();
            });
        }
      }
    },

    _: {
      get: (req, res) => {
        let data = { error: null, movie: {} };
        let reply = () => res.status(data.error ? data.error.code || 500 : 200).json(data);

        let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
        if (isNaN(id)) {
          data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
          reply();
        } else {
          tmdb.movie.details({ movie_id: id, append_to_response: 'credits' })
            .then(movie => {
              data.movie = new models.Movie(movie.id,
                movie.title,
                movie.original_title,
                movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : null,
                movie.overview,
                movie.poster_path,
                movie.credits.cast.sort((a, b) => a.order - b.order).slice(0, 8).map(cast => new models.Character(cast.id,
                  cast.name,
                  cast.profile_path,
                  cast.character)));
              reply();
            })
            .catch(err => {
              console.error('TMDb: ' + err.message);
              data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
              reply();
            });
        }
      }
    }

  };
};
