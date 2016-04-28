'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = exports.dashCase = undefined;

var _some2 = require('lodash-compat/collection/some');

var _some3 = _interopRequireDefault(_some2);

var _kebabCase2 = require('lodash-compat/string/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashCase = exports.dashCase = _kebabCase3.default;
var some = exports.some = _some3.default;
