'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.any = exports.scss = undefined;

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _kebabCase2 = require('lodash/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  kebabCase: _kebabCase3.default,
  some: _some3.default
});

var scss = exports.scss = _lodashFp.kebabCase;
var any = exports.any = _lodashFp.some;