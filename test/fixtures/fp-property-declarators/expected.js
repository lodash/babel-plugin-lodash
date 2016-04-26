'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameFormatters = undefined;

var _some2 = require('lodash/fp/some');

var _some3 = _interopRequireDefault(_some2);

var _camelCase2 = require('lodash/fp/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _kebabCase2 = require('lodash/fp/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nameFormatters = exports.nameFormatters = {
  kebabCase: _kebabCase3.default,
  camelCase: _camelCase3.default,
  some: _some3.default
};
