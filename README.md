# babel-plugin-lodash v2.2.1

A simple transform to remove unused Lodash code without manual cherry picking
letting you use Lodash as a monolithic library without worrying about bundling
unused parts.

## Example

Transforms

```js
import _ from 'lodash';
import { add } from 'lodash/fp';

let add1 = add(1);
_.map([1, 2, 3], add1);
```

roughly to

```js
import _add from 'lodash/fp/add';
import _map from 'lodash/map';

let add1 = _add(1);
_map([1, 2, 3], add1);
```

## Usage

This plugin supports `lodash@^4.0.0` & `babel@^6.0.0`.

###### .babelrc (Recommended)

```json
{
  "plugins": ["lodash"]
}
```

###### Babel CLI

```sh
$ babel --plugins lodash script.js
```

###### Babel API

```js
require('babel-core').transform('code', {
  'plugins': ['lodash']
});
```

## FAQ

> Do import specifiers, e.g. `import { x } from 'lodash'`, work?

You [know it](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/multi-specifier/actual.js)!

> What about `lodash/fp`?

We’ve got [you covered](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/lodash-fp-specifiers/actual.js).

> Can this plugin produce ES6 imports rather than CommonJS imports?

This plugin produces ES6 imports by default. The
[babel-plugin-transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs)
plugin transforms the ES6 `import` statements to CommonJS. Omit it from your
presets if you want ES6 style imports.

## Limitations

* You must use ES6 imports to load `lodash`
* Babel < 6 isn’t supported
* Chain sequences aren’t supported. See [this blog post](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba) for alternatives.
* Modularized [method packages](https://www.npmjs.com/browse/keyword/lodash-modularized) aren’t supported
