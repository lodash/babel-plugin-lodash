'use strict';

var _camelCase2 = require('lodash/fp/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

var _map2 = require('lodash/fp/map');

var _map3 = _interopRequireDefault(_map2);

var _flow2 = require('lodash/fp/flow');

var _flow3 = _interopRequireDefault(_flow2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var result = (0, _flow3.default)((0, _map3.default)(_camelCase3.default), reverse)(['foo-bar', 'bar-baz', 'baz-quux']);
