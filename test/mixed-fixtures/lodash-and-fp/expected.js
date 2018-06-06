"use strict";

var _reject3 = _interopRequireDefault(require("lodash/fp/reject"));

var _add3 = _interopRequireDefault(require("lodash/fp/add"));

var _take3 = _interopRequireDefault(require("lodash/fp/take"));

var _map3 = _interopRequireDefault(require("lodash/fp/map"));

var _reject4 = _interopRequireDefault(require("lodash/reject"));

var _add4 = _interopRequireDefault(require("lodash/add"));

var _take4 = _interopRequireDefault(require("lodash/take"));

var _map4 = _interopRequireDefault(require("lodash/map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mapper = (0, _map3.default)((0, _add3.default)(1));
const result = mapper([]);
(0, _take3.default)(1, (0, _reject3.default)(Boolean, result));
const result2 = (0, _map4.default)([], n => (0, _add4.default)(1, n));
(0, _take4.default)((0, _reject4.default)(result2), 1);
