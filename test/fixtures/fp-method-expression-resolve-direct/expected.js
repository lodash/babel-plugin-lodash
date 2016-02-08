'use strict';

var _convert = require('lodash/fp/convert');

var _convert2 = _interopRequireDefault(_convert);

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

var _lodashFp = (0, _convert2.default)({
  identity: _identity2.default,
  noop: _noop2.default,
  map: _map2.default,
  filter: _filter2.default,
  pick: _pick2.default,
  omit: _omit2.default
});

var method = _lodashFp.identity || _lodashFp.noop;

var method2 = _lodashFp.noop ? _lodashFp.map : _lodashFp.filter;

(something ? _lodashFp.pick : _lodashFp.omit)(function () {}, obj);