#!/usr/bin/env node
'use strict';

let path = require('path');
let server = require(path.join('..', 'server'));

let expect = require('chai').expect;
let request = require('supertest');

describe('Movies', () => {
  describe('GET /search/:title', () => {
    it('should fail finding random gibberish', done => {
      request(server)
        .get('/m/search/naYCLinTurentHen')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          expect(res.body.movies).to.be.an('array').and.to.have.lengthOf(0);
        }).end(done);
    });

    it('should find Deadpool (2016)', done => {
      request(server)
        .get('/m/search/Deadpool')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          expect(res.body.movies).to.be.an('array').and.and.to.have.length.above(0);
          let movie = res.body.movies[0];
          expect(movie).to.be.an('object');
          expect(movie.id).to.eq(293660);

          expect(movie.title).to.eq('Deadpool');
          expect(movie.originalTitle).to.eq('Deadpool');
          expect(movie.year).to.eq(2016);
          expect(movie.posterUrl).to.be.a('string');
        }).end(done);
    });
  });

  describe('GET /:id', () => {
    it('should fetch Deadpool (2016)', done => {
      request(server)
        .get('/m/293660')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          let movie = res.body.movie;
          expect(movie).to.be.an('object');

          expect(movie.title).to.eq('Deadpool');
          expect(movie.originalTitle).to.eq('Deadpool');
          expect(movie.year).to.eq(2016);
          expect(movie.posterUrl).to.be.a('string');

          expect(movie.actors).to.be.an('array').and.and.to.have.length.above(0);
        }).end(done);
    });
  });
});
