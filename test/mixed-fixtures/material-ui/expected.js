'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoComplete = undefined;

var _AutoComplete2 = require('material-ui/AutoComplete');

var _AutoComplete3 = _interopRequireDefault(_AutoComplete2);

var _AppBar2 = require('material-ui/AppBar');

var _AppBar3 = _interopRequireDefault(_AppBar2);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

React.createElement(
  _MuiThemeProvider2.default,
  null,
  React.createElement(_AppBar3.default, null)
);

exports.AutoComplete = _AutoComplete3.default;
