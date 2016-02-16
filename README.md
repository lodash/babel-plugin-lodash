# babel-plugin-lodash

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
import _add from 'lodash/add';
import _map from 'lodash/map';
import convert from 'lodash/fp/convert';

const _fp = convert({
  'add': _add
});

let add1 = _fp.add(1);
_map([1, 2, 3], add1);
```

## Usage

This plugin supports `lodash@^4.0.0` & `babel@^6.0.0`.

###### Via `.babelrc` (Recommended)

```json
{
  "plugins": ["lodash"]
}
```

###### Via CLI

```sh
$ babel --plugins lodash script.js
```

###### Via Node API

```js
require('babel-core').transform('code', {
  'plugins': ['lodash']
});
```

## FAQ

> Does this work the modularized Lodash method packages?

For Lodash [method packages](https://www.npmjs.com/browse/keyword/lodash-modularized)
use [lodash-modularize](https://github.com/megawac/lodash-modularize).

> I receive `TypeError: The plugin "lodash" didn’t export a Plugin instance`<br>
> or, can I use this plugin with Babel v5?

Babel v5 is no longer supported. Use [v0.2.0](https://github.com/lodash/babel-plugin-lodash/tree/0.2.0)
for support.

> Do import specifiers, e.g. `import { x } from 'lodash'`, work?

You [know it](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/multi-specifier/actual.js)!

> What about `lodash/fp`?

We’ve got [you covered](https://github.com/lodash/babel-plugin-lodash/blob/master/test/fixtures/lodash-fp-specifiers/actual.js).

## Limitations

* You must be using ES6 imports to load `lodash`
* Chaining syntax is not supported
