"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function get() {
    return _map2.default;
  }
});
Object.defineProperty(exports, "foo", {
  enumerable: true,
  get: function get() {
    return _isObject2.default;
  }
});
Object.defineProperty(exports, "isObject", {
  enumerable: true,
  get: function get() {
    return _isObject2.default;
  }
});
Object.defineProperty(exports, "bar", {
  enumerable: true,
  get: function get() {
    return _foo.default;
  }
});

var _map2 = _interopRequireDefault(require("lodash/fp/map"));

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _foo = _interopRequireDefault(require("foo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

isObject(a);