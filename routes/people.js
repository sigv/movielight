#!/usr/bin/env node
/* eslint-env es6, node */
'use strict';

module.exports = (db, tmdb, models) => {
  return {

    search: {
      get: (req, res) => {
        let data = { error: null, people: [] };
        let reply = () => res.status(data.error ? data.error.code || 500 : 200).json(data);

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
        let reply = () => res.status(data.error ? data.error.code || 500 : 200).json(data);

        let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
        if (isNaN(id)) {
          data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
          reply();
        } else {
          tmdb.person.info({ id: id })
            .then(info => {
              tmdb.search.person({ query: info.name })
                .then(search => {
                  let result = search.results.filter(result => result.id === id)[0];
                  let knownFor = result ? result.known_for.sort((a, b) => b.vote_count - a.vote_count).slice(0, 10) : [];
                  data.person = new models.Person(info.id,
                    info.name,
                    info.profile_path,
                    info.also_known_as,
                    info.biography,
                    info.birthday ? +(new Date(info.birthday)) : null,
                    info.deathhday ? +(new Date(info.deathhday)) : null,
                    knownFor.map(result => new models.Movie(result.id,
                      result.title,
                      result.original_title,
                      result.release_date ? parseInt(result.release_date.split('-')[0], 10) : null,
                      result.overview,
                      result.poster_path)));
                  reply();
                })
                .catch(err => {
                  console.error('TMDb: ' + err.message);
                  data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
                  reply();
                });
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
