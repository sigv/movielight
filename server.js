#!/usr/bin/env node
/* eslint-env es6, node */
'use strict';

let path = require('path');

let env = require('get-env')();
let standalone = require.main === module;

let redis = require(env === 'dev' ? 'fakeredis' : 'redis');
let db = redis.createClient();

db.on('error', err => console.error(err.stack));

let tmdbKey = process.env.MOVIE_DB_KEY;
if (typeof tmdbKey !== 'string' || tmdbKey.trim() === '') {
  throw new Error('The `MOVIE_DB_KEY` environment variable is missing.');
}
let tmdb = new (require('tmdbapi'))({ apiv3: tmdbKey.trim() });

let express = require('express');
let app = express();
module.exports = app;

app.set('case sensitive routing', true);
app.set('env', env === 'dev' ? 'development' : 'production');
app.set('etag', 'strong');
app.set('port', process.env.PORT || 8080);
app.set('strict routing', true);
app.set('trust proxy', true);
app.set('x-powered-by', false);

if (standalone) { app.use(require('morgan')(env === 'dev' ? 'dev' : 'combined')); }
app.use(require('helmet')());
app.use(require('body-parser').json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'private, max-age=60');
  next();
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'bower_components')));

let models = require(path.join(__dirname, 'models'));

let configure = callback => {
  tmdb.configuration()
    .then(config => {
      models.config.setUpImage(config.images.secure_base_url,
        config.images.poster_sizes
          .map(size => size.match(/^w([0-9]+)$/))
          .filter(size => size)
          .sort((a, b) => a[1] - b[1])
          .slice(-1)[0][0],
        config.images.profile_sizes
          .map(size => size.match(/^w([0-9]+)$/))
          .filter(size => size)
          .sort((a, b) => a[1] - b[1])
          .slice(-1)[0][0]);

      callback(null);
    })
    .catch(err => callback(err));
};

configure(err => {
  if (err) {
    throw err;
  }

  let movies = require(path.join(__dirname, 'routes', 'movies'))(db, tmdb, models);
  app.route('/m/search/:title')
    .get(movies.search.get);
  app.route('/m/:id')
    .get(movies._.get);

  let people = require(path.join(__dirname, 'routes', 'people'))(db, tmdb, models);
  app.route('/p/search/:name')
    .get(people.search.get);
  app.route('/p/:id')
    .get(people._.get);

  if (standalone) {
    app.listen(app.get('port'));
    console.log('Listening on port ' + app.get('port'));
  }

  app.emit('configured', null);
});

setInterval(configure, 1000/* ms */ * 60/* s */ * 60/* m */ * 24/* h */, err => {
  if (err) {
    // We do have some old configuration we can work off of and that should be fine, but do dump the error.
    console.error('configure(err): ' + err.message);
  }
});

if (typeof before === 'function') {
  before(done => app.on('configured', done)); // eslint-disable-line no-undef
}
