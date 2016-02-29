'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _reject2 = require('lodash/reject');

var _reject3 = _interopRequireDefault(_reject2);

var _take2 = require('lodash/take');

var _take3 = _interopRequireDefault(_take2);

var _add2 = require('lodash/add');

var _add3 = _interopRequireDefault(_add2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  map: _map3.default,
  add: _add3.default,
  take: _take3.default,
  reject: _reject3.default
});

var mapper = _lodashFp.map(_lodashFp.add(1));
var result = mapper([1, 2, 3]);
_lodashFp.take(1, _lodashFp.reject(Boolean, result));