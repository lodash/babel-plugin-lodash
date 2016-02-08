'use strict';

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var method = _identity2.default || _noop2.default;

var method2 = _noop2.default ? _map2.default : _filter2.default;

(something ? _pick2.default : _omit2.default)(obj, function () {});