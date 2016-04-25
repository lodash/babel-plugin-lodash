'use strict';

import _ from 'lodash';
import mapping from './mapping';
import PackageStore from './PackageStore';
import resolveModule from './resolveModule';
import Store from './Store';

const lodashId = mapping.lodashId;
if (!lodashId) {
  throw new Error('Cannot find Lodash module');
}

/** The error message used when chain sequences are detected. */
const CHAIN_ERROR = [
  'Lodash chain sequences are not supported by babel-plugin-lodash.',
  'Consider substituting chain sequences with _.flow composition patterns.',
  'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'
].join('\n');

/*----------------------------------------------------------------------------*/

export default function({ 'types': types }) {

  const pathToIdentifer = new Map;

  /**
   * Tracking variables built during the AST pass. We instantiate these in the
   * `Program` visitor in order to support running the plugin in watch mode or
   * on multiple files.
   */
  const store = new Store(
    mapping.moduleMap.has('fp')
      ? [lodashId, 'lodash/fp']
      : [lodashId]
  );

  function buildDeclaratorHandler(prop) {
    return function(path) {
      const { node } = path;
      if (node[prop]) {
        const identifier = store.getValueBy('module', node[prop].name);
        if (identifier) {
          node[prop] = identifier;
        }
      }
    };
  }

  function buildExpressionHandler(props) {
    return function(path) {
      const { node } = path;
      props.forEach(prop => {
        const expressionNode = node[prop];
        if (!types.isIdentifier(expressionNode)) {
          return;
        }
        const identifier = store.getValueBy('module', expressionNode.name);
        if (identifier) {
          node[prop] = identifier;
        }
      });
    };
  }

  function importModule(methodName, file, base='', importName=methodName) {
    const path = `${ (base || '*') }/${ methodName }`;

    let result = pathToIdentifer.get(path);
    if (result === undefined) {
      const importPath = resolveModule(methodName, base);
      result = file.addImport(importPath, 'default', importName);
      pathToIdentifer.set(path, result);
    }
    return result;
  }

  function isDefaultImport(name) {
    return !!store.getStoreBy('default', name);
  }

  /*--------------------------------------------------------------------------*/

  return {
    'visitor': {

      /**
       * Instantiate all the necessary tracking variables for this AST.
       */
      'Program': {
        enter() {
          // Clear tracked method imports and tracked variables used to import Lodash.
          pathToIdentifer.clear();
          store.clear();
        }
      },

      ImportDeclaration(path) {
        const { file } = path.hub;
        const { node } = path;
        const { value: pkgId } = node.source;

        const pkgStore = store.get(pkgId);
        if (!pkgStore) {
          return;
        }
        const isFp = pkgId == 'lodash/fp';
        const importBase = isFp ? 'fp' : '';

        const defaultSet = pkgStore.get('default');
        const moduleMap = pkgStore.get('module');

        // Remove the original import node to be replaced.
        path.remove();

        // Track all the Lodash default and specifier imports in the source.
        node.specifiers.forEach(spec => {
          const localName = spec.local.name;

          if (types.isImportSpecifier(spec)) {
            // Handle import specifier (i.e. `import {map} from 'lodash'`).
            const identifier = importModule(spec.imported.name, file, importBase, localName);
            moduleMap.set(localName, identifier);
          }
          else {
            // Handle default specifier (i.e. `import _ from 'lodash'`).
            defaultSet.add(localName);
          }
        });
      },

      CallExpression(path) {
        const { node } = path;
        const { name } = node.callee;

        // Update the referenced import specifier if it's marked for replacement.
        const callee = store.getValueBy('module', name);
        if (callee) {
          node.callee = callee;
        }
        // Detect chain sequences via _(value).
        else if (isDefaultImport(name)) {
          throw new Error(CHAIN_ERROR);
        }
        // Support lodash methods used as call parameters (#11),
        // e.g. `_.flow(_.map, _.head)`.
        if (node.arguments) {
          node.arguments = node.arguments.map(arg => {
            const { name } = arg;
            const identifier = store.getValueBy('module', name);

            // Assume that is supposed to be a placeholder (#33).
            return isDefaultImport(name)
              ? types.memberExpression(node.callee, types.identifier('placeholder'))
              : (identifier || arg);
          });
        }
      },

      MemberExpression(path) {
        const { node } = path;
        const { file } = path.hub;
        const pkgStore = store.getStoreBy('default', node.object.name);

        if (pkgStore && node.property.name == 'chain') {
          // Detect chaining via `_.chain(value)`.
          throw new Error(CHAIN_ERROR);
        }
        if (pkgStore) {
          const isFp = pkgStore.id == 'lodash/fp';
          const importBase = isFp ? 'fp' : '';

          // Transform `_.foo()` to `_foo()`.
          path.replaceWith(importModule(node.property.name, file, importBase));
        }
      },

      ExportNamedDeclaration(path) {
        const { node } = path;
        const { file } = path.hub;

        if (!node.source) {
          return;
        }
        const pkgId = node.source.value;
        const pkgStore = store.get(pkgId);

        if (pkgStore) {
          const isFp = pkgId === 'lodash/fp';
          const importBase = isFp ? 'fp' : '';

          node.source = undefined;
          node.specifiers.forEach(specifier => {
            specifier.local = importModule(specifier.local.name, file, importBase);
          });
        }
      },

      // Various other (less common) ways to use a lodash specifier. This code
      // doesn't apply to uses on a lodash object only directly imported specifiers.

      // See #34.
      'Property': buildDeclaratorHandler('value'),
      'VariableDeclarator': buildDeclaratorHandler('init'),

      // Allow things like `var x = y || _.noop`. See #28.
      'LogicalExpression': buildExpressionHandler(['left', 'right']),

      // Allow things like `var x = y ? _.identity : _.noop`. See #28.
      'ConditionalExpression': buildExpressionHandler(['test', 'consequent', 'alternate'])
    }
  };
};
