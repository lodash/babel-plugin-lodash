'use strict';

var _reject2 = require('ramda/src/reject');

var _reject3 = _interopRequireDefault(_reject2);

var _values2 = require('ramda/src/values');

var _values3 = _interopRequireDefault(_values2);

var _add3 = require('ramda/src/add');

var _add4 = _interopRequireDefault(_add3);

var _take3 = require('ramda/src/take');

var _take4 = _interopRequireDefault(_take3);

var _map3 = require('ramda/src/map');

var _map4 = _interopRequireDefault(_map3);

var _take5 = require('lodash-bound/take');

var _take6 = _interopRequireDefault(_take5);

var _map5 = require('lodash-bound/map');

var _map6 = _interopRequireDefault(_map5);

var _add5 = require('lodash-bound/add');

var _add6 = _interopRequireDefault(_add5);

var _context2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var object = { 'a': -1, 'b': 0, 'c': 1 };

var mapper = (0, _map4.default)((0, _add4.default)(1));
var result = mapper(object);
ftake(1, (0, _values3.default)((0, _reject3.default)(Boolean, result)));

var result2 = _map6.default.call(object, function (n) {
  var _context;

  return (_context = 1, add).call(_context, n);
});
(_context2 = reject.call(result2), take).call(_context2, 1);
