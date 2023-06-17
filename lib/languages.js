'use strict';

exports.html = {
  BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/,
  BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/,
  BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/,
  BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/,
  BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/
};

const jsBlock = {
  BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
  BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
};

const jsLine = {
  LINE_REGEX: /^\/\/(!?).*/
};

exports.javascript = {
  ...jsBlock,
  ...jsLine
};

exports.js = exports.javascript;
exports.css = { ...jsBlock };
exports.less = exports.javascript;
exports.sass = exports.javascript;
exports.ts = exports.javascript;
exports.typscript = exports.javascript;
exports.xml = exports.html;
