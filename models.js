#!/usr/bin/env node
'use strict';

class Configuration {
  constructor () {
    this.setUpImage('', '', '');
  }

  toJSON () {
    return {};
  }

  get imageBase () { return this._imageBase; }
  set imageBase (val) { this._imageBase = typeof val === 'string' ? val : ''; }

  get imagePosterSize () { return this._imagePosterSize; }
  set imagePosterSize (val) { this._imagePosterSize = typeof val === 'string' ? val : ''; }

  get imageProfileSize () { return this._imageProfileSize; }
  set imageProfileSize (val) { this._imageProfileSize = typeof val === 'string' ? val : ''; }

  setUpImage (base, posterSize, profileSize) {
    this.imageBase = base;
    this.imagePosterSize = posterSize;
    this.imageProfileSize = profileSize;
  }
}

let config = new Configuration();

class Movie {
  constructor (id, title, originalTitle, year, posterUrl, cast) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.year = year;
    this.posterUrl = posterUrl;
    this.cast = cast;
  }

  toJSON () {
    let { id, title, originalTitle, year, posterUrl, cast } = this;
    return { id, title, originalTitle, year, posterUrl, cast };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get title () { return this._title; }
  set title (val) { this._title = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get originalTitle () { return this._originalTitle; }
  set originalTitle (val) { this._originalTitle = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get year () { return this._year; }
  set year (val) { this._year = typeof val === 'number' && !isNaN(val) ? val : null; }

  get posterUrl () { return config.imageBase + config.imagePosterSize + this._posterUrl; }
  set posterUrl (val) { this._posterUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get cast () { return this._cast; }
  set cast (val) { this._cast = Array.isArray(val) ? val.filter(item => item instanceof Character) : []; }
}

class Person {
  constructor (id, name, imageUrl, alsoKnownAs, yearBorn, yearDied, movies) {
    this.id = id;
    this.name = name;
    this.alsoKnownAs = alsoKnownAs;
    this.imageUrl = imageUrl;
    this.yearBorn = yearBorn;
    this.yearDied = yearDied;
    this.movies = movies;
  }

  toJSON () {
    let { id, name, alsoKnownAs, imageUrl, yearBorn, yearDied, movies } = this;
    return { id, name, alsoKnownAs, imageUrl, yearBorn, yearDied, movies };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get name () { return this._name; }
  set name (val) { this._name = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get alsoKnownAs () { return this._alsoKnownAs; }
  set alsoKnownAs (val) { this._alsoKnownAs = Array.isArray(val) ? val.filter(item => typeof item === 'string' && item.trim() !== '') : []; }

  get imageUrl () { return config.imageBase + config.imageProfileSize + this._imageUrl; }
  set imageUrl (val) { this._imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get yearBorn () { return this._yearBorn; }
  set yearBorn (val) { this._yearBorn = typeof val === 'number' && !isNaN(val) ? val : null; }

  get yearDied () { return this._yearDied; }
  set yearDied (val) { this._yearDied = typeof val === 'number' && !isNaN(val) ? val : null; }

  get movies () { return this._movies; }
  set movies (val) { this._movies = Array.isArray(val) ? val.filter(item => item instanceof Movie) : []; }
}

class Character {
  constructor (id, name, imageUrl, role) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.role = role;
  }

  toJSON () {
    let { id, name, imageUrl, role } = this;
    return { id, name, imageUrl, role };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get name () { return this._name; }
  set name (val) { this._name = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get imageUrl () { return config.imageBase + config.imageProfileSize + this._imageUrl; }
  set imageUrl (val) { this._imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get role () { return this._role; }
  set role (val) { this._role = typeof val === 'string' && val.trim() !== '' ? val : null; }
}

module.exports = { config, Movie, Person, Character };
