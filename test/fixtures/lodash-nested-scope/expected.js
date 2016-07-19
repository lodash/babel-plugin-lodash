'use strict';

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo(object) {
  return (0, _merge3.default)(object, { 'a': 1 });
}
