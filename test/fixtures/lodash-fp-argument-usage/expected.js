'use strict';

var _head2 = require('lodash/fp/head');

var _head3 = _interopRequireDefault(_head2);

var _capitalize2 = require('lodash/fp/capitalize');

var _capitalize3 = _interopRequireDefault(_capitalize2);

var _flowRight2 = require('lodash/fp/flowRight');

var _flowRight3 = _interopRequireDefault(_flowRight2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var c = (0, _flowRight3.default)(_capitalize3.default, _head3.default);

c(['a', 'b']);