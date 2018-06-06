"use strict";

var _map2 = _interopRequireDefault(require("lodash/map"));

var _filter2 = _interopRequireDefault(require("lodash/filter"));

var _convert = _interopRequireDefault(require("lodash-fp/convert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fp = (0, _convert.default)({
  filter: _filter2.default,
  map: _map2.default
});
