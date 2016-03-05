'use strict';

import resolveModule from './lodash-modules';

export default function({ 'types': t }) {
  // Tracking variables build during the AST pass. We instantiate
  // these in the `Program` visitor in order to support running the
  // plugin in watch mode or on multiple files.
  let lodashObjs,
      fpObjs,
      fpSpecified,
      specified,
      selectedMethods;

  const CHAIN_ERROR = `lodash chaining syntax is not supported by babel-plugin-lodash.
Consider substituting the chaining syntax with _.flow and _.flowRight composition patterns.
See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba`;

  // Import a lodash method and return the computed import identifier.
  // The goal of this function is to only import a method+base pair once
  // per program. It is safe to reuse import identifiers.
  function importMethod(methodName, file, base, importName=methodName) {
    // methodPath is used to create a unique identifier of a method+base pair
    // in order to track the source of the import. This is useful, for example,
    // if the program includes fp/map and lodash/map (fp/ is one base whereas */ is the other)
    var methodPath = `${base || '*'}/${methodName}`;
    if (!selectedMethods[methodPath]) {
      let importPath = resolveModule(methodName, base);
      selectedMethods[methodPath] = file.addImport(importPath, 'default', importName);
    }
    return selectedMethods[methodPath];
  }

  return {
    'visitor': {

      // Instantiate all the necessary tracking variables for this AST.
      'Program': {
        enter() {
          // Track the variables used to import lodash.
          lodashObjs = Object.create(null);
          specified = Object.create(null);

          // Trackers for lodash-fp support.
          fpObjs = Object.create(null);
          fpSpecified = Object.create(null);

          // Track the methods that have already been used to prevent dupe imports.
          selectedMethods = Object.create(null);
        }
      },

      ImportDeclaration(path) {
        let { node } = path;
        let { value } = node.source;
        let fp = value == 'lodash/fp';
        let { file } = path.hub;

        if (fp || value == 'lodash') {
          // Remove the original import node, for replacement.
          path.remove();

          // Start tracking all the import specifiers and default instances
          // of lodash imported in the program
          node.specifiers.forEach(spec => {
            if (t.isImportSpecifier(spec)) {
              // handle import specifier (i.e. `import {map} from 'lodash'`)
              let importBase = fp ? 'fp' : null;
              (fp ? fpSpecified : specified)[spec.local.name] =
                importMethod(spec.imported.name, file, importBase, spec.local.name);
            } else {
              // handle default specifier (i.e. `import _ from 'lodash'`)
              (fp ? fpObjs : lodashObjs)[spec.local.name] = true;
            }
          });
        }
      },

      CallExpression(path) {
        let { node } = path;
        let { name } = node.callee;

        if (!t.isIdentifier(node.callee)) {
          return;
        }
        // Update the referenced import specifier if its marked for replacement
        if (specified[name]) {
          node.callee = specified[name];
        }
        else if (fpSpecified[name]) {
          node.callee = fpSpecified[name];
        }
        // Detect chaining via _(value).
        else if (lodashObjs[name]) {
          throw new Error(CHAIN_ERROR);
        }
        if (node.arguments) {
          node.arguments = node.arguments.map(arg => {
            const { name } = arg;
            return specified[name] || arg;
          });
        }
      },

      MemberExpression(path) {
        let { node } = path;
        let { file } = path.hub;

        if (lodashObjs[node.object.name] && node.property.name == 'chain') {
          // Detect chaining via _.chain(value).
          throw new Error(CHAIN_ERROR);
        }
        else if (lodashObjs[node.object.name]) {
          // Transform _.foo() to _foo().
          path.replaceWith(importMethod(node.property.name, file));
        }
        else if (fpObjs[node.object.name]) {
          path.replaceWith(importMethod(node.property.name, file, 'fp'));
        }
      },

      // Various other (less common) ways to use a lodash specifier
      // This code doesn't apply to uses on a lodash object
      // only directly imported specifiers.

      // See #34
      Property: buildDeclaratorHandler('value'),
      // See #34
      VariableDeclarator: buildDeclaratorHandler('init'),

      // Allow things like `var x = y || _.noop` (see #28)
      LogicalExpression: buildExpressionHandler(['left', 'right']),

      // Allow things like `var x = y ? _.identity : _.noop` (see #28)
      ConditionalExpression: buildExpressionHandler(['test', 'consequent', 'alternate'])
    }
  };

  function buildDeclaratorHandler(prop) {
    return function(path) {
      let { node } = path;

      let name = node[prop].name;
      if (specified[name]) {
        node[prop] = specified[name];
      }
      else if (fpSpecified[name]) {
        node[prop] = fpSpecified[name];
      }
    };
  }

  function buildExpressionHandler(props) {
    return function(path) {
      let { node } = path;

      props.forEach(prop => {
        let n = node[prop], name = n.name;
        if (!t.isIdentifier(n)) return;

        if (specified[name]) {
          node[prop] = specified[prop];
        }
        else if (fpSpecified[name]) {
          // Transform map() to fp.map() in order to avoid destructuring fp.
          node[prop] = fpSpecified[name];
        }
      });
    };
  }
}
