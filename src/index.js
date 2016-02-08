import resolveModule from './lodash-modules';
import _ from 'lodash';

export default function({ Plugin, types: t }) {
  // Tracking variables build during the AST pass. We instantiate
  // these in the `Program` visitor in order to support running the
  // plugin in watch mode or on multiple files. 
  let lodashObjs, specified, fpObjs, fpSpecified,
      selectedMethods, lodashFpIdentifier;

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      let path = resolveModule(methodName);
      selectedMethods[methodName] = file.addImport(path);
    }
    return selectedMethods[methodName];
  }

  const CHAIN_ERR = 'lodash chaining syntax is not yet supported';

  return new Plugin('lodash', {
    visitor: {

      // Instantiate all the necessary tracking variables for this AST.
      Program() {
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

      ImportDeclaration(node, parent, scope) {
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
          this.dangerouslyRemove();
        }
        if (fp && !lodashFpIdentifier) {
          lodashFpIdentifier = scope.generateUidIdentifier('lodashFp');
        }
      },

      CallExpression(node, parent, scope, file) {
        let {name} = node.callee;
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

      MemberExpression(node, parent, scope, file) {
        if (lodashObjs[node.object.name] && node.property.name === 'chain') {
          // Detect chaining via _.chain(value)
          throw new Error(CHAIN_ERR);
        } else if (lodashObjs[node.object.name]) {
          // _.foo() -> _foo()
          return importMethod(node.property.name, file);
        } else if (fpObjs[node.object.name]) {
          importMethod(node.property.name, file);
          node.object = lodashFpIdentifier;
        }
      },

      // Allow things like `var x = y || _.noop` (see #28)
      LogicalExpression: buildExpressionHandler(['left', 'right']),

      // Allow things like `var x = y ? _.identity : _.noop` (see #28)
      ConditionalExpression: buildExpressionHandler(['test', 'consequent', 'alternate']),

      exit(node, parent, scope, file) {
        if (!t.isProgram(node)) return;

        if (lodashFpIdentifier) {
          // Setup the lodash-fp instance with the selected methods.
          let id = file.addImport('lodash-fp/convert');
          let fpSetup = t.callExpression(id, [
            t.objectExpression(_.map(selectedMethods, (identifier, name) => {
              return t.property('init', t.literal(name), identifier);
            }))
          ]);
          // Inject the setup into the top of the program (after imports).
          node.body.unshift(t.variableDeclaration('const', [
            t.variableDeclarator(lodashFpIdentifier, fpSetup)
          ]));
        }
      }
    }
  });

  function buildExpressionHandler(props) {
    return function(node, parent, scope, file) {
      props.forEach(prop => {
        let n = node[prop], name = n.name;
        if (!t.isIdentifier(n)) return;

        if (specified[name]) {
          node[prop] = importMethod(specified[name], file);
        }
        else if (fpSpecified[name]) {
          // Transform map() to fp.map() in order to avoid destructuring fp.
          importMethod(fpSpecified[name], file);
          node[prop] = t.memberExpression(lodashFpIdentifier, t.identifier(fpSpecified[name]));
        }
      });
    };
  }
}
