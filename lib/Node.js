'use strict';

class Node {
  constructor(node) {
    this.type = node.type;
    if (node.value) this.value = node.value;
    if (node.match) this.match = node.match;
    this.newline = node.newline || '';
  }
  get protected() {
    return Boolean(this.match) && this.match[1] === '!';
  }

  get content() {
    return this.value || '';
  }
}

class Block extends Node {
  constructor(node) {
    super(node);
    this.nodes = node.nodes || [];
  }
  push(node) {
    this.nodes.push(node);
  }
  get protected() {
    return this.nodes.length > 0 && this.nodes[0].protected === true;
  }

  get content() {
    return this.nodes.map(node => node.content).join('');
  }
}

class Quote extends Block {
  constructor(char) {
    super({ type: 'quote' });
    this.char = char;
  }
}

module.exports = { Node, Block, Quote };
