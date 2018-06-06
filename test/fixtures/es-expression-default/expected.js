"use strict";

var _pick2 = _interopRequireDefault(require("lodash-es/pick"));

var _omit2 = _interopRequireDefault(require("lodash-es/omit"));

var _filter2 = _interopRequireDefault(require("lodash-es/filter"));

var _map2 = _interopRequireDefault(require("lodash-es/map"));

var _noop2 = _interopRequireDefault(require("lodash-es/noop"));

var _identity2 = _interopRequireDefault(require("lodash-es/identity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const func1 = _identity2.default || _noop2.default;
const func2 = _noop2.default ? _map2.default : _filter2.default;
_noop2.default;
(bool ? _omit2.default : _pick2.default)(object);