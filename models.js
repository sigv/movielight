#!/usr/bin/env node
'use strict';

class Movie {
  constructor (id, title, originalTitle, year, posterUrl, actors) {
    this._id = id;
    this._title = title;
    this._originalTitle = originalTitle;
    this._year = year;
    this._posterUrl = posterUrl;
    this._actors = actors;
  }

  toJSON () {
    let { id, title, originalTitle, year, posterUrl, actors } = this;
    return { id, title, originalTitle, year, posterUrl, actors };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get title () { return this._title; }
  set title (val) { this._title = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get originalTitle () { return this._originalTitle; }
  set originalTitle (val) { this._originalTitle = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get year () { return this._year; }
  set year (val) { this._year = typeof val === 'number' && !isNaN(val) ? val : null; }

  get posterUrl () { return this._posterUrl; }
  set posterUrl (val) { this._posterUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get actors () { return this._actors; }
  set actors (val) { this._actors = Array.isArray(val) ? val.filter(item => { return item instanceof Person; }) : []; }
}

class Person {
  constructor (id, name, alsoKnownAs, yearBorn, yearDied, imageUrl, movies) {
    this._id = id;
    this._name = name;
    this._alsoKnownAs = alsoKnownAs;
    this._yearBorn = yearBorn;
    this._yearDied = yearDied;
    this._imageUrl = imageUrl;
    this._movies = movies;
  }

  toJSON () {
    let { id, name, alsoKnownAs, yearBorn, yearDied, imageUrl, movies } = this;
    return { id, name, alsoKnownAs, yearBorn, yearDied, imageUrl, movies };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get name () { return this._name; }
  set name (val) { this._name = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get alsoKnownAs () { return this._alsoKnownAs; }
  set alsoKnownAs (val) { this._alsoKnownAs = Array.isArray(val) ? val.filter(item => { return typeof item === 'string' && item.trim() !== ''; }) : []; }

  get yearBorn () { return this._yearBorn; }
  set yearBorn (val) { this._yearBorn = typeof val === 'number' && !isNaN(val) ? val : null; }

  get yearDied () { return this._yearDied; }
  set yearDied (val) { this._yearDied = typeof val === 'number' && !isNaN(val) ? val : null; }

  get imageUrl () { return this._imageUrl; }
  set imageUrl (val) { this._imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get movies () { return this._movies; }
  set movies (val) { this._movies = Array.isArray(val) ? val.filter(item => { return item instanceof Movie; }) : []; }
}

module.exports = { Movie, Person };
