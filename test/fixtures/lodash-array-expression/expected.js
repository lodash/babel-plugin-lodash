'use strict';

var _partial2 = require('lodash/fp/partial');

var _partial3 = _interopRequireDefault(_partial2);

var _round2 = require('lodash/round');

var _round3 = _interopRequireDefault(_round2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _isNumber2 = require('lodash/isNumber');

var _isNumber3 = _interopRequireDefault(_isNumber2);

var _cond2 = require('lodash/cond');

var _cond3 = _interopRequireDefault(_cond2);

var _capitalize2 = require('lodash/capitalize');

var _capitalize3 = _interopRequireDefault(_capitalize2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _cond3.default)([[_isNumber3.default, _round3.default], [_isString3.default, _capitalize3.default]])(1.8);

(0, _partial3.default)(function (a, b) {
  return [a, b];
})([_partial3.default.placeholder, 2]);
