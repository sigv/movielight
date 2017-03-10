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
              data.people = person.results.map(person => {
                return new models.Person(person.id,
                  person.name,
                  person.known_for,
                  person.birthday ? parseInt(person.birthday.split('-')[0], 10) : null,
                  person.deathhday ? parseInt(person.deathhday.split('-')[0], 10) : null,
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
          tmdb.person.info({ id: id })
            .then(info => {
              data.person = new models.Person(info.id,
                info.name,
                info.known_for,
                info.birthday ? parseInt(info.birthday.split('-')[0], 10) : null,
                info.deathhday ? parseInt(info.deathhday.split('-')[0], 10) : null,
                info.profile_path,
                []);
              tmdb.person.movie_credits({ id: id })
                .then(credits => {
                  data.person.movies = credits.cast.map(credit => {
                    return new models.Movie(credit.id,
                      credit.title,
                      credit.original_title,
                      credit.release_date ? parseInt(credit.release_date.split('-')[0], 10) : null,
                      credit.poster_path,
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
