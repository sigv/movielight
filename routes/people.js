#!/usr/bin/env node
/* eslint-env es6, node */
'use strict';

module.exports = (db, tmdb, models) => {
  return {

    search: {
      get: (req, res) => {
        let data = { error: null, people: [] };
        let setPerson = person => {
          data.people = person.results.map(person => new models.Person(person.id,
            person.name,
            person.profile_path));
          res.status(data.error ? data.error.code || 500 : 200).json(data);
        };

        let name = typeof req.params.name === 'string' ? req.params.name.trim().split('-').join(' ') : '';
        if (name === '') {
          data.error = { code: 400, message: 'A searchable string name must be provided.' };
          res.status(data.error.code).json(data);
        } else {
          let cacheKey = '/search/person?' + name;
          db.get(cacheKey, (err, person) => {
            if (err) {
              console.error('Cache: ' + err.message);
            } else if (person) {
              try {
                setPerson(JSON.parse(person));
                return;
              } catch (err) {
                console.error('Cache: ' + err.message);
              }
            }

            tmdb.search.person({ query: name })
              .then(person => {
                db.setex(cacheKey, 60/* s */ * 30/* min */, JSON.stringify(person), err => {
                  if (err) {
                    console.error('Cache: ' + err.message);
                  }

                  setPerson(person);
                });
              })
              .catch(err => {
                console.error('TMDb: ' + err.message);
                data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
                res.status(data.error.code).json(data);
              });
          });
        }
      }
    },

    _: {
      get: (req, res) => {
        let data = { error: null, person: {} };
        let setInfoSearch = (info, search) => {
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
          res.status(data.error ? data.error.code || 500 : 200).json(data);
        };
        let setInfo = info => {
          let cacheKey = '/search/person?' + info.name;
          db.get(cacheKey, (err, search) => {
            if (err) {
              console.error('Cache: ' + err.message);
            } else if (search) {
              try {
                setInfoSearch(info, JSON.parse(search));
                return;
              } catch (err) {
                console.error('Cache: ' + err.message);
              }
            }

            tmdb.search.person({ query: info.name })
              .then(search => {
                db.setex(cacheKey, 60/* s */ * 30/* min */, JSON.stringify(search), err => {
                  if (err) {
                    console.error('Cache: ' + err.message);
                  }

                  setInfoSearch(info, search);
                });
              })
              .catch(err => {
                console.error('TMDb: ' + err.message);
                data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
                res.status(data.error.code).json(data);
              });
          });
        };

        let id = typeof req.params.id === 'string' ? parseInt(req.params.id, 10) : NaN;
        if (isNaN(id)) {
          data.error = { code: 400, message: 'A gettable integer ID must be provided.' };
          res.status(data.error.code).json(data);
        } else {
          let cacheKey = '/person/' + id;
          db.get(cacheKey, (err, info) => {
            if (err) {
              console.error('Cache: ' + err.message);
            } else if (info) {
              try {
                setInfo(JSON.parse(info));
                return;
              } catch (err) {
                console.error('Cache: ' + err.message);
              }
            }

            tmdb.person.info({ id: id })
              .then(info => {
                db.setex(cacheKey, 60/* s */ * 30/* min */, JSON.stringify(info), err => {
                  if (err) {
                    console.error('Cache: ' + err.message);
                  }

                  setInfo(info);
                });
              })
              .catch(err => {
                console.error('TMDb: ' + err.message);
                data.error = { code: 503, message: 'The upstream API did not respond as expected.' };
                res.status(data.error.code).json(data);
              });
          });
        }
      }
    }

  };
};
