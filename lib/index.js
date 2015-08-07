'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashModules = require('./lodash-modules');

var _lodashModules2 = _interopRequireDefault(_lodashModules);

exports['default'] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  // Track the variables used to import lodash
  var lodashs = Object.create(null);
  var specified = Object.create(null);

  // Track the methods that have already been used to prevent dupe imports
  var selectedMethods = Object.create(null);

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      var path = (0, _lodashModules2['default'])(methodName);
      selectedMethods[methodName] = file.addImport(path, '_' + methodName);
    }
    return selectedMethods[methodName];
  }

  return new Plugin("lodash", {

    visitor: {
      ImportDeclaration: function ImportDeclaration(node, parent, scope) {
        if (node.source.value === 'lodash') {
          node.specifiers.forEach(function (spec) {
            if (t.isImportSpecifier(spec)) {
              specified[spec.local.name] = spec.imported.name;
            } else {
              lodashs[spec.local.name] = true;
            }
          });
          this.dangerouslyRemove();
        }
      },

      CallExpression: function CallExpression(node, parent, scope, file) {
        var name = node.callee.name;

        if (!t.isIdentifier(node.callee)) return;
        if (specified[name]) {
          node.callee = importMethod(specified[name], file);
          return node;
        }
        // Detect chaining
        else if (lodashs[name]) {
            throw new Error('lodash chaining syntax is not yet supported');
          }
      },

      MemberExpression: function MemberExpression(node, parent, scope, file) {
        if (!lodashs[node.object.name]) return;

        // _.foo() -> _foo()
        return importMethod(node.property.name, file);
      },

      exit: function exit(node) {
        if (!t.isProgram(node)) return;
        // Clean up tracking variables
        lodashs = Object.create(null);
        specified = Object.create(null);
        selectedMethods = Object.create(null);
      }
    }

  });
};

module.exports = exports['default'];