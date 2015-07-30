# babel-plugin-babel-lodash-modularize

Lodash modularized builds without the hassle

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-babel-lodash-modularize
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["babel-lodash-modularize"]
}
```

### Via CLI

```sh
$ babel --plugins babel-lodash-modularize script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["babel-lodash-modularize"]
});
```
