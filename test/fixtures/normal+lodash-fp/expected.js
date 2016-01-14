'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _reject = require('lodash/reject');

var _reject2 = _interopRequireDefault(_reject);

var _take = require('lodash/take');

var _take2 = _interopRequireDefault(_take);

var _add = require('lodash/add');

var _add2 = _interopRequireDefault(_add);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  map: _map2.default,
  add: _add2.default,
  take: _take2.default,
  reject: _reject2.default
});

var mapper = _lodashFp.map(_lodashFp.add(1));
var result = mapper([1, 2, 3]);
_lodashFp.take(1, _lodashFp.reject(Boolean, result));

var result2 = (0, _map2.default)([1, 2, 3], function () {});
(0, _take2.default)((0, _reject2.default)(result), 1);