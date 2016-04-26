'use strict';

var _capitalize2 = require('lodash-es/capitalize');

var _capitalize3 = _interopRequireDefault(_capitalize2);

var _map2 = require('lodash-es/map');

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var result = (0, _map3.default)(['foo', 'bar', 'baz'], _capitalize3.default);
