'use strict';

var _convert = require('lodash-fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _head = require('lodash/array/head');

var _head2 = _interopRequireDefault(_head);

var _capitalize = require('lodash/string/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _compose = require('lodash/function/compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  compose: _compose2.default,
  capitalize: _capitalize2.default,
  head: _head2.default
});

var c = _lodashFp.compose(_lodashFp.capitalize, _lodashFp.head);

c(['a', 'b']);
