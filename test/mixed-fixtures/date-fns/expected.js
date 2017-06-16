'use strict';

var _is_today = require('date-fns/is_today');

var _is_today2 = _interopRequireDefault(_is_today);

var _is_tomorrow = require('date-fns/is_tomorrow');

var _is_tomorrow2 = _interopRequireDefault(_is_tomorrow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _is_tomorrow2.default)(Date.now());
(0, _is_today2.default)(Date.now());
