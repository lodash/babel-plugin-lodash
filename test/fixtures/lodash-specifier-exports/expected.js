'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = exports.map = exports.isObject = exports.foo = undefined;

var _map2 = require('lodash/fp/map');

var _map3 = _interopRequireDefault(_map2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _foo = require('foo');

Object.defineProperty(exports, 'bar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_foo).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

isObject(a);

exports.foo = _isObject3.default;
exports.isObject = _isObject3.default;
exports.map = _map3.default;
