#!/usr/bin/env node
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

app.set('case sensitive routing', true);
app.set('env', env === 'dev' ? 'development' : 'production');
app.set('etag', 'strong');
app.set('port', process.env.PORT || 8080);
app.set('strict routing', true);
app.set('trust proxy', true);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('x-powered-by', false);

if (standalone) { app.use(require('morgan')(env === 'dev' ? 'dev' : 'combined')); }
app.use(require('helmet')());
app.use(require('body-parser').json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'private, max-age=60');
  next();
});

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  let data = { error: null };

  res.status(data.error ? data.error.code || 500 : 200);
  if (req.accepts('html') || !req.accepts('json')) {
    res.render('index', { data });
  } else {
    res.json(data);
  }
});

let movies = require(path.join(__dirname, 'routes', 'movies'))(db, tmdb);
app.route('/m/search/:title')
  .get(movies.search.get);
app.route('/m/:id')
  .get(movies._.get);

let people = require(path.join(__dirname, 'routes', 'people'))(db, tmdb);
app.route('/p/search/:name')
  .get(people.search.get);
app.route('/p/:id')
  .get(people._.get);

if (standalone) {
  app.listen(app.get('port'));
} else {
  module.exports = app;
}
