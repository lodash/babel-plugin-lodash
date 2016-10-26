'use strict';

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var o1 = { 'a': 1 };
var o2 = { 'b': 2, 'c': 3 };
var o3 = _extends({}, o1, o2);

var foo = o3.b,
    bar = _objectWithoutProperties(o3, ['b']);

(0, _keys3.default)(bar);
