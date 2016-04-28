'use strict';

var _toUpper2 = require('lodash/fp/toUpper');

var _toUpper3 = _interopRequireDefault(_toUpper2);

var _map2 = require('lodash/fp/map');

var _map3 = _interopRequireDefault(_map2);

var _first2 = require('lodash/fp/first');

var _first3 = _interopRequireDefault(_first2);

var _compose2 = require('lodash/fp/compose');

var _compose3 = _interopRequireDefault(_compose2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var c = (0, _compose3.default)((0, _map3.default)(_toUpper3.default), _first3.default);

c(['a', 'b']);
