'use strict';

var _map2 = require('_map');

var _map3 = _interopRequireDefault(_map2);

var _take2 = require('_take');

var _take3 = _interopRequireDefault(_take2);

var _reject2 = require('_reject');

var _reject3 = _interopRequireDefault(_reject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var result = (0, _map3['default'])([1, 2, 3], function () {});
(0, _take3['default'])((0, _reject3['default'])(result), 1);