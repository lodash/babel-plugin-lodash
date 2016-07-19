'use strict';

var _reject3 = require('lodash/fp/reject');

var _reject4 = _interopRequireDefault(_reject3);

var _add3 = require('lodash/fp/add');

var _add4 = _interopRequireDefault(_add3);

var _take3 = require('lodash/fp/take');

var _take4 = _interopRequireDefault(_take3);

var _map3 = require('lodash/fp/map');

var _map4 = _interopRequireDefault(_map3);

var _reject5 = require('lodash/reject');

var _reject6 = _interopRequireDefault(_reject5);

var _add5 = require('lodash/add');

var _add6 = _interopRequireDefault(_add5);

var _take5 = require('lodash/take');

var _take6 = _interopRequireDefault(_take5);

var _map5 = require('lodash/map');

var _map6 = _interopRequireDefault(_map5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapper = (0, _map4.default)((0, _add4.default)(1));
var result = mapper([]);
(0, _take4.default)(1, (0, _reject4.default)(Boolean, result));

var result2 = (0, _map6.default)([], function (n) {
  return (0, _add6.default)(1, n);
});
(0, _take6.default)((0, _reject6.default)(result2), 1);
