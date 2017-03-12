#!/usr/bin/env node
'use strict';

let path = require('path');
let server = require(path.join('..', 'server'));

let chai = require('chai');
chai.use(require('chai-string'));
let expect = chai.expect;
let request = require('supertest');

describe('People', () => {
  describe('GET /search/:name', () => {
    it('should fail finding random gibberish', done => {
      request(server)
        .get('/p/search/UsIGiNCo-siOnTRIo')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          expect(res.body.people).to.be.an('array').and.to.have.lengthOf(0);
        }).end(done);
    });

    it('should find Ryan Reynolds', done => {
      request(server)
        .get('/p/search/Ryan-Reynolds')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          expect(res.body.people).to.be.an('array').and.and.to.have.length.above(0);
          let person = res.body.people[0];
          expect(person).to.be.an('object');
          expect(person.id).to.eq(10859);

          expect(person.imageUrl).to.startWith('https://').and.to.endWith('.jpg');
          expect(person.alsoKnownAs).to.be.an('array');
        }).end(done);
    });
  });

  describe('GET /:id', () => {
    it('should fetch Ryan Reynolds', done => {
      request(server)
        .get('/p/10859')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(res => {
          expect(res.body.error).to.eq(null);

          let person = res.body.person;
          expect(person).to.be.an('object');

          expect(person.imageUrl).to.startWith('https://').and.to.endWith('.jpg');
          expect(person.alsoKnownAs).to.be.an('array');

          expect(person.yearBorn).to.be.a('number');
          expect(person.yearDied).to.eq(null); // TODO expect( .. ).to.be.a('number') ?
          expect(person.movies).to.be.an('array').and.and.to.have.length.within(1, 10);
          let movie = person.movies[0];
          expect(movie).to.be.an('object');
          expect(movie.id).to.eq(293660);
          expect(movie.title).to.eq('Deadpool');
          expect(movie.originalTitle).to.eq('Deadpool');
          expect(movie.year).to.eq(2016);
          expect(movie.posterUrl).to.startWith('https://').and.to.endWith('.jpg');
        }).end(done);
    });
  });
});
