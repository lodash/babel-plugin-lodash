"use strict";

var _merge2 = _interopRequireDefault(require("lodash/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo(object) {
  return (0, _merge2.default)(object, {
    'a': 1
  });
}