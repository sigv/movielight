#!/usr/bin/env node
'use strict';

class Person {
  constructor (id, name, alsoKnownAs, yearBorn, yearDied, imageUrl, movies) {
    this.id = id;
    this.name = name;
    this.alsoKnownAs = alsoKnownAs;
    this.yearBorn = yearBorn;
    this.yearDied = yearDied;
    this.imageUrl = imageUrl;
    this.movies = movies;
  }

  get id () { return this.id; }
  set id (val) { this.id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get name () { return this.name; }
  set name (val) { this.name = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get alsoKnownAs () { return this.alsoKnownAs; }
  set alsoKnownAs (val) { this.alsoKnownAs = Array.isArray(val) ? val.filter(item => { return typeof item === 'string' && item.trim() !== ''; }) : []; }

  get yearBorn () { return this.yearBorn; }
  set yearBorn (val) { this.yearBorn = typeof val === 'number' && !isNaN(val) ? val : null; }

  get yearDied () { return this.yearDied; }
  set yearDied (val) { this.yearDied = typeof val === 'number' && !isNaN(val) ? val : null; }

  get imageUrl () { return this.imageUrl; }
  set imageUrl (val) { this.imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get movies () { return this.movies; }
  set movies (val) { this.movies = Array.isArray(val) ? val.filter(item => { return item instanceof Movie; }) : []; }
}

class Movie {
  constructor (id, title, originalTitle, year, posterUrl, actors) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.year = year;
    this.posterUrl = posterUrl;
    this.actors = actors;
  }

  get id () { return this.id; }
  set id (val) { this.id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get title () { return this.title; }
  set title (val) { this.title = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get originalTitle () { return this.originalTitle; }
  set originalTitle (val) { this.originalTitle = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get year () { return this.year; }
  set year (val) { this.year = typeof val === 'number' && !isNaN(val) ? val : null; }

  get posterUrl () { return this.posterUrl; }
  set posterUrl (val) { this.posterUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get actors () { return this.actors; }
  set actors (val) { this.actors = Array.isArray(val) ? val.filter(item => { return item instanceof Person; }) : []; }
}

module.exports = { Movie };
