'use strict';

var _lodashFpConvert = require('lodash-fp/convert');

var _lodashFpConvert2 = _interopRequireDefault(_lodashFpConvert);

var _lodashFp = (0, _lodashFpConvert2['default'])({});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var mapper = _lodashFp.map(_lodashFp.add(1));
var result = mapper([1, 2, 3]);
_lodashFp.take(1, _lodashFp.reject(Boolean, result));