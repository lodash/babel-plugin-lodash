babel-plugin-lodash [![Build Status](https://travis-ci.org/megawac/babel-plugin-lodash.svg?branch=master)](https://travis-ci.org/megawac/babel-plugin-lodash)
==============

The goal of this package is to be an alternative/augmentation of [lodash-modularize](https://github.com/megawac/lodash-modularize) which is designed with slightly different goals.

This plugin is a simple transform to remove unused lodash code, without forcing the user to cherry pick methods manually. This lets you use lodash naturally (aka as documented) without worrying about bundling parts you're not using.


#### Example

Converts

```js
import lodash from 'lodash';
import {add} from 'lodash-fp';

let add1 = add(1);

lodash.map([1, 2, 3], add1);
```

(roughly) to 

```js
import _map from 'lodash/collection/map';
import _add from 'lodash/math/add';
import convert from 'lodash-fp/convert';

const _fp = convert({
    add: _add
});

let add1 = _fp.add(1);

_map([1, 2, 3], add1);
```

### FAQ

> Where's my npm module support?

It will be implemented when plugins can support options ([babel/babel#1833](https://phabricator.babeljs.io/T1833)). (Resolved in Babel 6, todo implement in the plugin)

For now use [lodash-modularize](https://github.com/megawac/lodash-modularize).

> I receive `TypeError: The plugin "lodash" didn't export a Plugin instance`
> or, can I use with Babel v5

The latest release is incompatible with Babel v5. [Use version 0.2 of this plugin](https://github.com/megawac/babel-plugin-lodash/tree/v0.2.0) (`npm install babel-plugin-lodash@0.2`).

> Do import specifiers work (`import {x} from 'lodash'`)

[You know it!](https://github.com/megawac/babel-plugin-lodash/blob/master/test/fixtures/multi-mix-usage/actual.js) You can also use both specifiers and direct imports (`import _, {y} from 'lodash'`).

> What about `lodash-fp`?

We've got ya covered ([#3](https://github.com/megawac/babel-plugin-lodash/pull/3)). **Note**: this requires you to have both `lodash` and `lodash-fp` installed in the `node_modules`.

#### Limitations

- You must be using ES6 imports to load lodash.

- Chaining syntax is not supported

#### Usage

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

```javascript
require("babel-core").transform("code", {
  plugins: ["lodash"]
});
```
