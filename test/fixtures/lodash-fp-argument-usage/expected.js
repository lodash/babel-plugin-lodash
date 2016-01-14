'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _head = require('lodash/head');

var _head2 = _interopRequireDefault(_head);

var _capitalize = require('lodash/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _flowRight = require('lodash/flowRight');

var _flowRight2 = _interopRequireDefault(_flowRight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  flowRight: _flowRight2.default,
  capitalize: _capitalize2.default,
  head: _head2.default
});

var c = _lodashFp.flowRight(_lodashFp.capitalize, _lodashFp.head);

c(['a', 'b']);