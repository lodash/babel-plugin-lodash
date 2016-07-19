'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.case3 = exports.case2 = exports.case1 = undefined;

var _kebabCase2 = require('lodash/fp/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

var _camelCase2 = require('lodash/fp/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _string = require('string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var case1 = exports.case1 = _camelCase3.default;
var case2 = exports.case2 = _kebabCase3.default;
var case3 = exports.case3 = _string.snakeCase;
