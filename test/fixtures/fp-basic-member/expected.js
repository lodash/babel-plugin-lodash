'use strict';

var _take2 = require('lodash/fp/take');

var _take3 = _interopRequireDefault(_take2);

var _reject2 = require('lodash/fp/reject');

var _reject3 = _interopRequireDefault(_reject2);

var _map2 = require('lodash/fp/map');

var _map3 = _interopRequireDefault(_map2);

var _add2 = require('lodash/fp/add');

var _add3 = _interopRequireDefault(_add2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapper = (0, _map3.default)((0, _add3.default)(1));
var result = mapper([]);
(0, _take3.default)(1, (0, _reject3.default)(Boolean, result));
