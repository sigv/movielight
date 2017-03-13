# Movie Light

[![Build Status](https://travis-ci.org/sigv/movielight.svg?branch=master)](https://travis-ci.org/sigv/movielight)
[![JavaScript Semi-Standard Style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

Spotlight search service for movies.

## Setting up

You will need your own API key for [TMDb](https://www.themoviedb.org/) to work with this application. Don't worry, applying for one is free.

```sh
$ git clone https://github.com/sigv/movielight.git && \
  cd movielight && \
  npm install && \
  MOVIE_DB_KEY='Your API Key for TMDb' npm start
```

## Developing

Some build automation is taken care of by [gulp](http://gulpjs.com/). When working on any change, just run `gulp` and everything will be taken care of as long as you keep in mind that the tests will require the `MOVIE_DB_KEY` environment variable to be set. The test cases are written in the [Mocha](https://mochajs.org/) framework and can be easily triggered by themselves by running `npm test`.

---

[![Certified By Cousin Terio](https://forthebadge.com/images/badges/certified-cousin-terio.svg)](http://forthebadge.com)
[![Powered By Electricity](http://forthebadge.com/images/badges/powered-by-electricity.svg)](http://forthebadge.com)
