'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baz = exports.some = exports.dashCase = undefined;

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _kebabCase2 = require('lodash/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

var _foo = require('foo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashCase = exports.dashCase = _kebabCase3.default;
var some = exports.some = _some3.default;
var baz = exports.baz = _foo.bar;
