/*!
 * important multiline
 * block comment
 */
'use strict';

var foo = function(/* and these single-line block comment */) {};

/**
 * and this
 * multiline block
 * comment
 */
var bar = function(/* and that */) {};

/*!
 * important multiline
 * block comment
 */

var baz = '//bar baz not a comment';

//! this single-line important comment
var qux = function() {
  // this multiline
  // line comment
  var some = true;
  //this
  var fafa = true; //and this
  // var also = 'that';
  var but = 'not'; //! that comment
};

/**!
 * and this important
 * block comment
 */
// also this multiline
// line comment
var fun = false;
var path = '/path/to/*/something/that/not/be/stripped.js';
var globstar = '/path//to//globstar/not/be/stripped/**/*.js';
