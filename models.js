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
  constructor (id, title, originalTitle, year, description, posterUrl, cast) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.year = year;
    this.description = description;
    this.posterUrl = posterUrl;
    this.cast = cast;
  }

  toJSON () {
    let { id, title, originalTitle, year, description, posterUrl, cast } = this;
    return { id, title, originalTitle, year, description, posterUrl, cast };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get title () { return this._title; }
  set title (val) { this._title = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get originalTitle () { return this._originalTitle; }
  set originalTitle (val) { this._originalTitle = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get year () { return this._year; }
  set year (val) { this._year = typeof val === 'number' && !isNaN(val) ? val : null; }

  get description () { return this._description; }
  set description (val) { this._description = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get posterUrl () { return this._posterUrl ? config.imageBase + config.imagePosterSize + this._posterUrl : null; }
  set posterUrl (val) { this._posterUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get cast () { return this._cast; }
  set cast (val) { this._cast = Array.isArray(val) ? val.filter(item => item instanceof Character) : []; }
}

class Person {
  constructor (id, name, imageUrl, alsoKnownAs, dateBorn, dateDied, movies) {
    this.id = id;
    this.name = name;
    this.alsoKnownAs = alsoKnownAs;
    this.imageUrl = imageUrl;
    this.dateBorn = dateBorn;
    this.dateDied = dateDied;
    this.movies = movies;
  }

  toJSON () {
    let { id, name, alsoKnownAs, imageUrl, age, movies } = this;
    return { id, name, alsoKnownAs, imageUrl, age, movies };
  }

  get id () { return this._id; }
  set id (val) { this._id = typeof val === 'number' && !isNaN(val) ? val : null; }

  get name () { return this._name; }
  set name (val) { this._name = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get alsoKnownAs () { return this._alsoKnownAs; }
  set alsoKnownAs (val) { this._alsoKnownAs = Array.isArray(val) ? val.filter(item => typeof item === 'string' && item.trim() !== '') : []; }

  get imageUrl () { return this._imageUrl ? config.imageBase + config.imageProfileSize + this._imageUrl : null; }
  set imageUrl (val) { this._imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get age () { return this.dateBorn ? Math.floor(((this.dateDied ? this.dateDied : Date.now()) - this.dateBorn) / 1000/* ms */ / 60/* s */ / 60/* min */ / 24/* h */ / 365.25/* d */) : null; }

  get dateBorn () { return this._dateBorn; }
  set dateBorn (val) { this._dateBorn = typeof val === 'number' && !isNaN(val) ? val : null; }

  get dateDied () { return this._dateDied; }
  set dateDied (val) { this._dateDied = typeof val === 'number' && !isNaN(val) ? val : null; }

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

  get imageUrl () { return this._imageUrl ? config.imageBase + config.imageProfileSize + this._imageUrl : null; }
  set imageUrl (val) { this._imageUrl = typeof val === 'string' && val.trim() !== '' ? val : null; }

  get role () { return this._role; }
  set role (val) { this._role = typeof val === 'string' && val.trim() !== '' ? val : null; }
}

module.exports = { config, Movie, Person, Character };
