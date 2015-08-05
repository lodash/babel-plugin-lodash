# babel-plugin-lodash

Lodash modularized builds without the hassle

#### Assumptions

- You must be using ES6 imports to load lodash.

- Imports are at top of file (we do the transform in one pass, if they are at the bottom of the file they may be missed)