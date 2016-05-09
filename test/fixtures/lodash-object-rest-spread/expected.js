'use strict';

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var object1 = { 'a': 1 };
var object2 = { 'b': 2, 'c': 3 };
var object3 = _extends({}, object1, object2);
var foo = object3.a;

var bar = _objectWithoutProperties(object3, ['a']);

(0, _keys3.default)(bar);
