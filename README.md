# babel-plugin-lodash

A simple transform to cherry-pick Lodash modules so you don’t have to.

Combine with [lodash-webpack-plugin](https://www.npmjs.com/package/lodash-webpack-plugin)
for even smaller cherry-picked builds!

## Install

```shell
$ npm i --save lodash
$ npm i --save-dev babel-plugin-lodash @babel/cli @babel/preset-env
```

## Example

Transforms
```js
import _ from 'lodash'
import { add } from 'lodash/fp'

const addOne = add(1)
_.map([1, 2, 3], addOne)
```

roughly to
```js
import _add from 'lodash/fp/add'
import _map from 'lodash/map'

const addOne = _add(1)
_map([1, 2, 3], addOne)
```

## Usage

###### .babelrc
```json
{
  "plugins": ["lodash"],
  "presets": [["@babel/env", { "targets": { "node": 6 } }]]
}
```

Set plugin options using an array of `[pluginName, optionsObject]`.
```json
{
  "plugins": [["lodash", { "id": "lodash-compat", "cwd": "some/path" }]],
  "presets": [["@babel/env", { "targets": { "node": 6 } }]]
}
```

The `options.id` can be an array of ids.
```json
{
  "plugins": [["lodash", { "id": ["async", "lodash-bound"] }]],
  "presets": [["@babel/env", { "targets": { "node": 6 } }]]
}
```

###### Babel CLI
```sh
$ babel --plugins lodash --presets @babel/es2015 script.js
```

###### Babel API
```js
require('babel-core').transform('code', {
  'plugins': ['lodash'],
  'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
})
```

###### webpack.config.js
```js
'module': {
  'loaders': [{
    'loader': 'babel-loader',
    'test': /\.js$/,
    'exclude': /node_modules/,
    'query': {
      'plugins': ['lodash'],
      'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
    }
  }]
}
```

## Codemod

There is a [codemod](https://github.com/huchenme/lodash-codemods#named-import) available to help you convert all of your cherry-pick imports to a combined named import.

## FAQ

> Can this plugin produce ES2015 imports rather than CommonJS imports?

This plugin produces ES2015 imports by default. The
[`@babel/plugin-transform-modules-commonjs`](https://www.npmjs.com/package/@babel/plugin-transform-modules-commonjs)
plugin, which is included in the [`@babel/preset-es2015`](https://www.npmjs.com/package/@babel/preset-es2015)
preset, transforms ES2015 `import` statements to CommonJS. Omit it from your
preset to preserve ES2015 style imports.

## Limitations

* You must use ES2015 imports to load Lodash
* Babel < 6 & Node.js < 4 aren’t supported
* Chain sequences aren’t supported. See [this blog post](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba) for alternatives.
* Modularized [method packages](https://www.npmjs.com/browse/keyword/lodash-modularized) aren’t supported
