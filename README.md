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

> Does this work the modularized Lodash method packages?

For Lodash [method packages](https://www.npmjs.com/browse/keyword/lodash-modularized)
use [lodash-modularize](https://github.com/megawac/lodash-modularize).

> Can the plugin produce ES6 `import`s rather than CommonJS (`require`) imports?

This plugin produces ES6 imports by default - [babel-plugin-transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs) is what transforms the ES6 `import` statements to CommonJS. Omit this plugin from your presets if you want ES6 style imports.

> I receive `TypeError: The plugin "lodash" didn’t export a Plugin instance`<br>
> or, can I use this plugin with Babel v5?

Babel v5 is no longer supported. Use [v0.3.0](https://github.com/lodash/babel-plugin-lodash/tree/0.3.0)
for support.

> Do import specifiers, e.g. `import { x } from 'lodash'`, work?

You [know it](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/multi-specifier/actual.js)!

> What about `lodash/fp`?

We’ve got [you covered](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/lodash-fp-specifiers/actual.js).

## Limitations

* You must be using ES6 imports to load `lodash`
* Chaining syntax is not supported. See [this blog post](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba) for alternatives.
