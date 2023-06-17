# Comment stripping loader for webpack

`comment-stripper` is a _webpack_ loader that strips away all or some of the comments while processing the source files.

## Getting started

More than likely, you have your project configured and building correctly and you are here just to clean up your bundles. If that is not the case, _"God save the Queen, man"_.

### Installation
```
yarn add comment-stripper --dev
```
or
```
npm install comment-stripper --save-dev
```
### Configuration

Simply add `comment-stripper` to your loaders in `webpack.config.js`:

```js
module.exports = { 
  // ...
  module: {
    rules: [
      { 
        test: /\.scss$/, 
        use: ['css-loader', 'comment-stripper', 'sass-loader'] 
      }
    ]
  }
};
```

#### Options
By default, `comment-stripper` removes all unimportant comments and hoists the protected ones, dropping duplicates, to the top of the output. This behavior can be modified:

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          {
            loader: 'comment-stripper',
            options: {
              safe: true
            }
          }, 
          'sass-loader',
        ]
      }
    ]
  }
};
```

##### safe
| Type      | Default |
|-----------|---------|
| `boolean` | `true`  |

When `true`, unimportant comments are removed and one copy of the protected ones, identified by an exclamation mark following the opening (e.g. `/*!` and `//!`), is hoisted to the top of the output.

Setting it `false` will result in removal of all comments, important and unimportant.

##### keepProtected
| Type      | Default |
|-----------|---------|
| `boolean` | `false` |

When `true`, the `safe` option is overridden so unimportant comments are removed and all protected comments are left in place.

When `false`, the behavior is driven by the `safe` option.

##### language
| Type     | Default      |
|----------|--------------|
| `string` | `javascript` |

A value of `js`, `ts`, `javascript`, `typescript`, `sass`, or `less` strips blocks of `/* */` comments and single-line `// ...` comments.

A value of `css` strips blocks of `/* */` comments; CSS doesn't support single-line `// ...` comments.

A value of `html` or `xml` strips blocks of `<!-- -->` comments. 

##### line
| Type      | Default |
|-----------|---------|
| `boolean` | `true`  |

When `false`, single-line `// ...` comments would NOT be stripped away.

##### block
| Type      | Default |
|-----------|---------|
| `boolean` | `true`  |

When `false`, blocks of `/* */` and `<!-- -->` comments would NOT be stripped away.

### API

`comment-stripper` can also be used on its own to strip out comments.

```js
const { strip } = require('comment-stripper');

const output = strip(
  'const foo = "bar";// this is a comment\n /* me too */', 
  { safe: true }
);
// Do something with output
```
