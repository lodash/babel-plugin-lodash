babel-plugin-lodash
==============

Lodash modularized builds without the hassle

#### Example

Converts

```js
import lodash from 'lodash';

lodash.map([1, 2, 3], function() {
	
});
```

to 

```js
import _map from 'lodash/collection/map';

_map([1, 2, 3], function() {
	
});
```

#### Usage

###### Via `.babelrc` (Recommended)

**.babelrc**

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


#### Assumptions

- You must be using ES6 imports to load lodash.

- Imports are at top of file (we do the transform in one pass, if they are at the bottom of the file they may be missed)

- Chaining syntax is not supported