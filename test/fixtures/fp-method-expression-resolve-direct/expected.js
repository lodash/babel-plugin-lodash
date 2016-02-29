'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _identity2 = require('lodash/identity');

var _identity3 = _interopRequireDefault(_identity2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _lodashFp = (0, _convert2.default)({
  identity: _identity3.default,
  noop: _noop3.default,
  map: _map3.default,
  filter: _filter3.default,
  pick: _pick3.default,
  omit: _omit3.default
});

var method = _lodashFp.identity || _lodashFp.noop;

var method2 = _lodashFp.noop ? _lodashFp.map : _lodashFp.filter;

(something ? _lodashFp.pick : _lodashFp.omit)(function () {}, obj);