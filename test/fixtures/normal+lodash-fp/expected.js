'use strict';

var _lodashCollectionMap2 = require('lodash/collection/map');

var _lodashCollectionMap3 = _interopRequireDefault(_lodashCollectionMap2);

var _lodashMathAdd2 = require('lodash/math/add');

var _lodashMathAdd3 = _interopRequireDefault(_lodashMathAdd2);

var _lodashArrayTake2 = require('lodash/array/take');

var _lodashArrayTake3 = _interopRequireDefault(_lodashArrayTake2);

var _lodashCollectionReject2 = require('lodash/collection/reject');

var _lodashCollectionReject3 = _interopRequireDefault(_lodashCollectionReject2);

var _lodashFpConvert2 = require('lodash-fp/convert');

var _lodashFpConvert3 = _interopRequireDefault(_lodashFpConvert2);

var _lodashFp = (0, _lodashFpConvert3['default'])({
  'map': _lodashCollectionMap3['default'],
  'add': _lodashMathAdd3['default'],
  'take': _lodashArrayTake3['default'],
  'reject': _lodashCollectionReject3['default']
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var mapper = _lodashFp.map(_lodashFp.add(1));
var result = mapper([1, 2, 3]);
_lodashFp.take(1, _lodashFp.reject(Boolean, result));

var result2 = (0, _lodashCollectionMap3['default'])([1, 2, 3], function () {});
(0, _lodashArrayTake3['default'])((0, _lodashCollectionReject3['default'])(result), 1);