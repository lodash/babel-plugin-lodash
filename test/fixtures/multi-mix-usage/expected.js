'use strict';

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashArrayTake = require('lodash/array/take');

var _lodashArrayTake2 = _interopRequireDefault(_lodashArrayTake);

var _lodashCollectionReject = require('lodash/collection/reject');

var _lodashCollectionReject2 = _interopRequireDefault(_lodashCollectionReject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var result = (0, _lodashCollectionMap2['default'])([1, 2, 3], function () {});
(0, _lodashArrayTake2['default'])((0, _lodashCollectionReject2['default'])(result), 1);
