'use strict';

const compile = (cst, options = {}) => {
  const keepProtected = options.keepProtected === true;
  const playSafe = !keepProtected && options.safe !== false;
  const seenBlocks = new Set();

  const walk = (node) => {
    let output = '';

    for (const child of node.nodes) {
      switch (child.type) {
        case 'block':
          if (child.protected) {
            if (keepProtected) {
              output += walk(child, node);
            } else if (playSafe) {
              seenBlocks.add(child.content.trim());
            }
          }
          break;

        case 'line':
          if (child.protected) {
            if (keepProtected) {
              output += child.value;
            } else if (playSafe) {
              seenBlocks.add(child.content.trim());
            }
          }
          break;

        case 'quote':
          output += child.content;
          break;

        case 'open':
        case 'close':
        case 'text':
        case 'newline':
        default: {
          output += child.value || '';
          break;
        }
      }
    }

    return output;
  };

  const result = walk(cst);
  if (!playSafe) return result;

  const hasBOM = result.startsWith('\ufeff');
  const importantBlocks = Array.from(seenBlocks).filter(block => block).join('\n');

  return (hasBOM ? '\ufeff' : '') + (importantBlocks ? importantBlocks + '\n\n' : '') + result.trim() + '\n';
};

module.exports = compile;
