'use strict';

var _capitalize = require('lodash/string/capitalize');

var _capitalize2 = _interopRequireDefault(_capitalize);

var _map = require('lodash/collection/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var result = (0, _map2.default)(['foo', 'bar', 'baz'], _capitalize2.default);
