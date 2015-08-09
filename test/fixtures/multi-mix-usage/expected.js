'use strict';

var _lodashCollectionMap2 = require('lodash/collection/map');

var _lodashCollectionMap3 = _interopRequireDefault(_lodashCollectionMap2);

var _lodashArrayTake2 = require('lodash/array/take');

var _lodashArrayTake3 = _interopRequireDefault(_lodashArrayTake2);

var _lodashCollectionReject2 = require('lodash/collection/reject');

var _lodashCollectionReject3 = _interopRequireDefault(_lodashCollectionReject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var result = (0, _lodashCollectionMap3['default'])([1, 2, 3], function () {});
(0, _lodashArrayTake3['default'])((0, _lodashCollectionReject3['default'])(result), 1);