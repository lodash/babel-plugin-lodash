'use strict';

var _lodashArrayZipObject = require('lodash/array/zipObject');

var _lodashArrayZipObject2 = _interopRequireDefault(_lodashArrayZipObject);

var _lodashObjectResult = require('lodash/object/result');

var _lodashObjectResult2 = _interopRequireDefault(_lodashObjectResult);

var _lodashCollectionIncludes = require('lodash/collection/includes');

var _lodashCollectionIncludes2 = _interopRequireDefault(_lodashCollectionIncludes);

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = resolveModule;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodashCliLibMapping = require('lodash-cli/lib/mapping');

// Slow synchronous version of https://github.com/megawac/lodash-modularize/blob/master/src/lodashModules.js
// Using the paths lodash-cli provides is not an option as they may change version to version =(

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDirectories(srcpath) {
  return _fs2['default'].readdirSync(srcpath).filter(function (file) {
    return _fs2['default'].statSync(_path2['default'].join(srcpath, file)).isDirectory();
  });
}

var expectedPath = './node_modules/lodash';
var modularizePath = _path2['default'].join(__dirname, '../node_modules/lodash');

var lodashPath = _fs2['default'].existsSync(expectedPath) ? expectedPath : modularizePath;
var m = getDirectories(lodashPath);

var funcs = m.map(function (val) {
  return _fs2['default'].readdirSync(_path2['default'].join(lodashPath, val)).map(function (name) {
    return name.slice(0, -3);
  });
});

var modules = (0, _lodashArrayZipObject2['default'])(m, funcs);

exports.modules = modules;

function resolveModule(name) {
  var realName = (0, _lodashObjectResult2['default'])(_lodashCliLibMapping.aliasToReal, name, name);

  for (var category in modules) {
    if ((0, _lodashCollectionIncludes2['default'])(modules[category], realName)) {
      return _path2['default'].join('lodash', category, realName);
    }
  }
  throw new Error('lodash method ' + name + ' was not in known modules\n    Please file a bug if it\'s my fault https://github.com/megawac/babel-plugin-lodash/issues\n  ');
}

;