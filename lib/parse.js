'use strict';

const { Node, Block, Quote } = require('./Node');
const languages = require('./languages');

const constants = {
  ESCAPED_CHAR_REGEX: /^\\./,
  QUOTE_REGEX: /^['"`]/,
  NEWLINE_REGEX: /^\r*\n/
};

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  const cst = new Block({ type: 'root', nodes: [] });
  const stack = [cst];
  const name = options.language?.toLowerCase() || 'javascript';
  const lang = languages[name];

  if (typeof lang === 'undefined') {
    throw new Error(`Language "${name}" is not supported by strip-comments`);
  }

  const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
  let block = cst;
  let remaining = input;
  let token;
  let prev;

  /**
   * Helpers
   */

  const consume = (value = remaining[0] || '') => {
    remaining = remaining.slice(value.length);
    return value;
  };

  const scan = (regex, type = 'text') => {
    const match = regex.exec(remaining);
    if (match) {
      consume(match[0]);
      return { type, value: match[0], match };
    }
  };

  const push = node => {
    if (prev?.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }
    block.push(node);
    if (node.nodes) {
      stack.push(node);
      block = node;
    }
    prev = node;
  };

  const pop = () => {
    if (block.type === 'root') {
      throw new SyntaxError('Unclosed block comment');
    }
    prev = undefined;
    stack.pop();
    block = stack[stack.length - 1];
  };

  /**
   * Parse input string
   */

  while (remaining !== '') {
    // escaped characters
    if ((token = scan(constants.ESCAPED_CHAR_REGEX))) {
      push(new Node(token));
      continue;
    }

    // quoted strings
    if (block.type === 'root') {
      if ((token = scan(constants.QUOTE_REGEX))) {
        push(new Quote(token.match[0]));
        push(new Node(token));
        continue;
      }
    }

    if (block.type === 'quote' && remaining.startsWith(block.char)) {
      push(new Node({ type: 'text', value: consume(remaining[0]) }));
      pop();
      continue;
    }

    // block comment open
    if (BLOCK_OPEN_REGEX && options.block && block.type === 'root') {
      if ((token = scan(BLOCK_OPEN_REGEX, 'open'))) {
        push(new Block({ type: 'block' }));
        push(new Node(token));
        continue;
      }
    }

    // block comment close
    if (BLOCK_CLOSE_REGEX && block.type === 'block' && options.block) {
      if ((token = scan(BLOCK_CLOSE_REGEX, 'close'))) {
        token.newline = token.match[1] || '';
        push(new Node(token));
        pop();
        continue;
      }
    }

    // line comment
    if (LINE_REGEX && block.type === 'root' && options.line) {
      if ((token = scan(LINE_REGEX, 'line'))) {
        push(new Node(token));

        continue;
      }
    }

    // Plain text (skip "C" since some languages use "C" to start comments)
    if ((token = scan(/^[a-zABD-Z0-9\r\n\t ]+/))) {
      push(new Node(token));
      continue;
    }

    push(new Node({ type: 'text', value: consume() }));
  }

  return cst;
};

module.exports = parse;
