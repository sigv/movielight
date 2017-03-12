#!/usr/bin/env node
'use strict';

let path = require('path');
let server = require(path.join('..', 'server'));

before(done => server.on('configured', done));
