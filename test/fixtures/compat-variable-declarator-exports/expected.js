"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.case3 = exports.case2 = exports.case1 = void 0;

var _kebabCase2 = _interopRequireDefault(require("lodash-compat/string/kebabCase"));

var _camelCase2 = _interopRequireDefault(require("lodash-compat/string/camelCase"));

var _string = require("string");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const case1 = _camelCase2.default;
exports.case1 = case1;
const case2 = _kebabCase2.default;
exports.case2 = case2;
const case3 = _string.snakeCase;
exports.case3 = case3;