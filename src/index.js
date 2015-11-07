import resolveModule from './lodash-modules';
import _ from 'lodash';

export default function({ types: t }) {
  // Tracking variables build during the AST pass. We instantiate
  // these in the `Program` visitor in order to support running the
  // plugin in watch mode or on multiple files. 
  let lodashObjs, specified, fpObjs, fpSpecified,
      selectedMethods, lodashFpIdentifier;

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      let path = resolveModule(methodName);
      selectedMethods[methodName] = file.addImport(path, 'default');
    }
    return selectedMethods[methodName];
  }

  const CHAIN_ERR = 'lodash chaining syntax is not yet supported';

  return {
    visitor: {

      // Instantiate all the necessary tracking variables for this AST.
      Program: {
        enter() {
          // Track the variables used to import lodash
          lodashObjs = Object.create(null);
          specified = Object.create(null);

          // Trackers for lodash-fp support
          fpObjs = Object.create(null);
          fpSpecified = Object.create(null);

          // Track the methods that have already been used to prevent dupe imports
          selectedMethods = Object.create(null);
          lodashFpIdentifier = null;
        },
        exit(path, state) {
          if (lodashFpIdentifier) {
            // Setup the lodash-fp instance with the selected methods.
            let id = path.hub.file.addImport('lodash-fp/convert', 'default');
            let fpSetup = t.callExpression(id, [
              t.objectExpression(_.map(selectedMethods, (identifier, name) => {
                return t.objectProperty(t.identifier(name), identifier);
              }))
            ]);
            // Inject the setup into the top of the program (after imports).
            path.node.body.unshift(t.variableDeclaration('var', [
              t.variableDeclarator(lodashFpIdentifier, fpSetup)
            ]));
          }
        }
      },

      ImportDeclaration(path, state) {
        let {node, scope} = path;
        let {value} = node.source;
        let fp = value === 'lodash-fp';
        if (fp || value === 'lodash') {
          node.specifiers.forEach(spec => {
            if (t.isImportSpecifier(spec)) {
              (fp ? fpSpecified: specified)[spec.local.name] = spec.imported.name;
            } else {
              (fp ? fpObjs : lodashObjs)[spec.local.name] = true;
            }
          });
          // Remove the original import node, for replacement.
          path.remove();
        }
        if (fp && !lodashFpIdentifier) {
          lodashFpIdentifier = scope.generateUidIdentifier('lodashFp');
        }
      },

      CallExpression(path, state) {
        let {node} = path;
        let {name} = node.callee;
        let {file} = path.hub;
        if (!t.isIdentifier(node.callee)) return;
        if (specified[name]) {
          node.callee = importMethod(specified[name], file);
        }
        else if (fpSpecified[name]) {
          // map() -> fp.map() in order to avoid destructuring fp
          importMethod(fpSpecified[name], file);
          node.callee = t.memberExpression(lodashFpIdentifier, t.identifier(fpSpecified[name]));
        }
        // Detect chaining via _(value)
        else if (lodashObjs[name]) {
          throw new Error(CHAIN_ERR);
        }
      },

      MemberExpression(path) {
        let {node} = path;
        let {file} = path.hub;
        if (lodashObjs[node.object.name] && node.property.name === 'chain') {
          // Detect chaining via _.chain(value)
          throw new Error(CHAIN_ERR);
        } else if (lodashObjs[node.object.name]) {
          // _.foo() -> _foo()
          path.replaceWith(importMethod(node.property.name, file));
        } else if (fpObjs[node.object.name]) {
          importMethod(node.property.name, file);
          node.object = lodashFpIdentifier;
        }
      },

    }
  };
}
