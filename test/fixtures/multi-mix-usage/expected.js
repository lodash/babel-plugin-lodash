'use strict';

var _reject = require('lodash/collection/reject');

var _reject2 = _interopRequireDefault(_reject);

var _take = require('lodash/array/take');

var _take2 = _interopRequireDefault(_take);

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var result = (0, _map2.default)([1, 2, 3], function () {});
(0, _take2.default)((0, _reject2.default)(result), 1);