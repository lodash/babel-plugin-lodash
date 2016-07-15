'use strict';

var _range2 = require('lodash/range');

var _range3 = _interopRequireDefault(_range2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function myFunc() {}

myFunc(_range3.default, _noop3.default);
myFunc(_noop3.default, _noop3.default);
myFunc(_range3.default, _noop3.default, _noop3.default);
myFunc(_range3.default, _noop3.default, _range3.default, _noop3.default);
myFunc(_range3.default, _noop3.default, _range3.default, _noop3.default, _range3.default);
