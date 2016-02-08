'use strict';

var _lodashUtilityIdentity2 = require('lodash/utility/identity');

var _lodashUtilityIdentity3 = _interopRequireDefault(_lodashUtilityIdentity2);

var _lodashUtilityNoop2 = require('lodash/utility/noop');

var _lodashUtilityNoop3 = _interopRequireDefault(_lodashUtilityNoop2);

var _lodashCollectionMap2 = require('lodash/collection/map');

var _lodashCollectionMap3 = _interopRequireDefault(_lodashCollectionMap2);

var _lodashCollectionFilter2 = require('lodash/collection/filter');

var _lodashCollectionFilter3 = _interopRequireDefault(_lodashCollectionFilter2);

var _lodashObjectPick2 = require('lodash/object/pick');

var _lodashObjectPick3 = _interopRequireDefault(_lodashObjectPick2);

var _lodashObjectOmit2 = require('lodash/object/omit');

var _lodashObjectOmit3 = _interopRequireDefault(_lodashObjectOmit2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var method = _lodashUtilityIdentity3['default'] || _lodashUtilityNoop3['default'];

var method2 = _lodashUtilityNoop3['default'] ? _lodashCollectionMap3['default'] : _lodashCollectionFilter3['default'];

(something ? _lodashObjectPick3['default'] : _lodashObjectOmit3['default'])(obj, function () {});