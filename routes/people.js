#!/usr/bin/env node
'use strict';

module.exports = (db, tmdb, models) => {
  return {

    search: {
      get: (req, res) => {
        let data = { error: null, people: [] };
        let reply = () => {
          res.status(data.error ? data.error.code || 500 : 200);
          if (req.accepts('html') || !req.accepts('json')) {
            res.render('people-search', { data });
          } else {
            res.json(data);
          }
        };

        let name = typeof req.params.name === 'string' ? req.params.name.trim().split('-').join(' ') : '';
        if (name === '') {
          data.error = { code: 400, message: 'A searchable string name must be provided.' };
          reply();
        } else {
          tmdb.search.person({ query: name })
            .then(person => {
              data.people = person.results.map(person => new models.Person(person.id,
                person.name,
                person.profile_path));
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
        let data = { error: null, person: {} };
        let reply = () => {
          res.status(data.error ? data.error.code || 500 : 200);
          if (req.accepts('html') || !req.accepts('json')) {
            res.render('people', { data });
          } else {
            res.json(data);
          }
        };

        let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
        if (isNaN(id)) {
          data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
          reply();
        } else {
          tmdb.person.info({ id: id, append_to_response: 'movie_credits' })
            .then(info => {
              data.person = new models.Person(info.id,
                info.name,
                info.profile_path,
                info.also_known_as,
                info.birthday ? parseInt(info.birthday.split('-')[0], 10) : null,
                info.deathhday ? parseInt(info.deathhday.split('-')[0], 10) : null,
                info.movie_credits.cast.map(credit => new models.Movie(credit.id,
                  credit.title,
                  credit.original_title,
                  credit.release_date ? parseInt(credit.release_date.split('-')[0], 10) : null,
                  credit.poster_path)).slice(0, 10));
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
