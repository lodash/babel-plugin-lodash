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

var _lodashFpConvert2 = require('lodash-fp/convert');

var _lodashFpConvert3 = _interopRequireDefault(_lodashFpConvert2);

var _lodashFp = (0, _lodashFpConvert3['default'])({
  'identity': _lodashUtilityIdentity3['default'],
  'noop': _lodashUtilityNoop3['default'],
  'map': _lodashCollectionMap3['default'],
  'filter': _lodashCollectionFilter3['default'],
  'pick': _lodashObjectPick3['default'],
  'omit': _lodashObjectOmit3['default']
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var method = _lodashFp.identity || _lodashFp.noop;

var method2 = _lodashFp.noop ? _lodashFp.map : _lodashFp.filter;

(something ? _lodashFp.pick : _lodashFp.omit)(function () {}, obj);