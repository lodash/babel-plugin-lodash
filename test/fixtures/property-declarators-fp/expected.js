'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameFormatters = undefined;

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _camelCase2 = require('lodash/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _kebabCase2 = require('lodash/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  kebabCase: _kebabCase3.default,
  camelCase: _camelCase3.default,
  some: _some3.default
});

var nameFormatters = exports.nameFormatters = {
  scss: _lodashFp.kebabCase,
  json: _lodashFp.camelCase,
  any: _lodashFp.some
};