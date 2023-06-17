'use strict';

const fs = require('fs');
const { strip } = require('..');

const content = fs.readFileSync('test/fixtures/strip-all.js', 'utf8');

// console.log(strip.block(content));
// console.log(strip.line(content));
console.log(strip(content));
