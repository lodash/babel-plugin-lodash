import resolveModule from './lodash-modules';
import _ from 'lodash';

export default function({ Plugin, types: t }) {
  // Track the variables used to import lodash
  let lodashs = Object.create(null);
  let specified = Object.create(null);

  let fps = Object.create(null);
  let fpSpecified = Object.create(null);

  // Track the methods that have already been used to prevent dupe imports
  let selectedMethods = Object.create(null);

  let lodashFpIdentifier = false;

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      let path = resolveModule(methodName);
      selectedMethods[methodName] = file.addImport(path, '_' + methodName);
    }
    return selectedMethods[methodName];
  }

  return new Plugin("lodash", {

    visitor: {
      ImportDeclaration(node, parent, scope) {
        let {value} = node.source;
        let fp = value === 'lodash-fp';
        if (fp || value === 'lodash') {
          node.specifiers.forEach(spec => {
            if (t.isImportSpecifier(spec)) {
              (fp ? fpSpecified: specified)[spec.local.name] = spec.imported.name;
            } else {
              (fp ? fps : lodashs)[spec.local.name] = true;
            }
          });
          this.dangerouslyRemove();
        }
        if (fp) {
          lodashFpIdentifier = scope.generateUidIdentifier('lodashFp');
        }
      },

      CallExpression(node, parent, scope, file) {
        let {name} = node.callee;
        if (!t.isIdentifier(node.callee)) return;
        if (specified[name]) {
          node.callee = importMethod(specified[name], file);
          return node;
        } else if (fpSpecified[name]) {
          importMethod(fpSpecified[name], file);
          node.callee = t.memberExpression(lodashFpIdentifier, t.identifier(fpSpecified[name]));
        }
        // Detect chaining
        if (lodashs[name]) {
          throw new Error('lodash chaining syntax is not yet supported');
        }
      },

      MemberExpression(node, parent, scope, file) {
        if (lodashs[node.object.name]) {
          // _.foo() -> _foo()
          return importMethod(node.property.name, file);
        } else if (fps[node.object.name]) {
          importMethod(node.property.name, file);
          node.object = lodashFpIdentifier;
        }
      },

      exit(node, parent, scope, file) {
        if (!t.isProgram(node)) return;

        if (lodashFpIdentifier) {
          let id = file.addImport('lodash-fp/convert', '_fp');

          let fpSetup = t.callExpression(id, [
            t.objectExpression(_.map(selectedMethods, (identifier, name) => {
              return t.property('init', t.literal(name), identifier);
            }))
          ]);

          node.body.unshift(t.variableDeclaration('const', [
            t.variableDeclarator(lodashFpIdentifier, fpSetup)
          ]));
        }

        // Clean up tracking variables
        lodashs = Object.create(null);
        specified = Object.create(null);
        selectedMethods = Object.create(null);
        fps = Object.create(null);
        fpSpecified = Object.create(null);
        lodashFpIdentifier = false;

        return node;
      }
    }

  });
}
