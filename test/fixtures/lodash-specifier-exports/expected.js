'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = exports.map = exports.isObject = exports.foo = undefined;

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _isObject = require('lodash/fp/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _foo2 = require('foo');

Object.defineProperty(exports, 'bar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_foo2).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

isObject(a);

exports.foo = _isObject2.default;
exports.isObject = _isObject2.default;
exports.map = _map3.default;
