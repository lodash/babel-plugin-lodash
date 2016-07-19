'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatters = undefined;

var _snakeCase2 = require('lodash/fp/snakeCase');

var _snakeCase3 = _interopRequireDefault(_snakeCase2);

var _kebabCase2 = require('lodash/fp/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

var _camelCase2 = require('lodash/fp/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatters = exports.formatters = {
  camelCase: _camelCase3.default,
  'kebabCase': _kebabCase3.default,
  'snakeCase': _snakeCase3.default
};
