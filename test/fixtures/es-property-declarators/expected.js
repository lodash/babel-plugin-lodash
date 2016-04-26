'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameFormatters = undefined;

var _some2 = require('lodash-es/some');

var _some3 = _interopRequireDefault(_some2);

var _camelCase2 = require('lodash-es/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _kebabCase2 = require('lodash-es/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nameFormatters = exports.nameFormatters = {
  camelCase: _camelCase3.default,
  kebabCase: _kebabCase3.default,
  some: _some3.default
};
