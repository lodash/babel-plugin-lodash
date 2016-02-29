'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _head2 = require('lodash/head');

var _head3 = _interopRequireDefault(_head2);

var _capitalize2 = require('lodash/capitalize');

var _capitalize3 = _interopRequireDefault(_capitalize2);

var _flowRight2 = require('lodash/flowRight');

var _flowRight3 = _interopRequireDefault(_flowRight2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  flowRight: _flowRight3.default,
  capitalize: _capitalize3.default,
  head: _head3.default
});

var c = _lodashFp.flowRight(_lodashFp.capitalize, _lodashFp.head);

c(['a', 'b']);