babel-plugin-lodash [![Build Status](https://travis-ci.org/megawac/babel-plugin-lodash.svg?branch=master)](https://travis-ci.org/megawac/babel-plugin-lodash)
==============

The goal of this package is to be an alternative/augmentation of [lodash-modularize](https://github.com/megawac/lodash-modularize) which is designed with slightly different goals.

This is a simple transform to remove unused lodash code without being forced to cherry pick methods manually. This lets you write code as you expect without worrying about bundling parts of lodash you're not using.


#### Example

Converts

```js
import lodash from 'lodash';

lodash.map([1, 2, 3], function(x) {
	// ...
});
```

to 

```js
import _map from 'lodash/collection/map';

_map([1, 2, 3], function(x) {
	// ...
});
```

### FAQ

> Where's my npm module support?

It will be implemented when plugins can support options ([babel/babel#1833](https://github.com/babel/babel/issues/1833)).

For now use [lodash-modularize](https://github.com/megawac/lodash-modularize).

#### Limitations

- You must be using ES6 imports to load lodash.

- Imports are at top of file (we do the transform in one pass, if they are at the bottom of the file they may be missed)

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
