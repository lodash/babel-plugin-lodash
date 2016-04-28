'use strict';

import _ from 'lodash';
import config from './config';
import importModule from './importModule';
import mapping from './mapping';
import Store from './Store';

/** The error message used when chain sequences are detected. */
const CHAIN_ERROR = [
  'Lodash chain sequences are not supported by babel-plugin-lodash.',
  'Consider substituting chain sequences with _.flow composition patterns.',
  'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'
].join('\n');

/*----------------------------------------------------------------------------*/

export default function({ 'types': types }) {

  /**
   * Used to track variables built during the AST pass. We instantiate these in
   * the `Program` visitor in order to support running the plugin in watch mode
   * or on multiple files.
   *
   * @type Store
   */
  const store = new Store(
    mapping.module.has('fp')
      ? [mapping.id, 'lodash/fp']
      : [mapping.id]
  );

  function buildDeclaratorHandler(key) {
    return function(path) {
      const { node } = path;
      if (node[key]) {
        const identifier = store.getValueBy('member', node[key].name);
        if (identifier) {
          node[key] = identifier;
        }
      }
    };
  }

  function buildExpressionHandler(props) {
    return function(path) {
      const { node } = path;
      _.each(props, key => {
        const expressionNode = node[key];
        if (!types.isIdentifier(expressionNode)) {
          return;
        }
        const identifier = store.getValueBy('member', expressionNode.name);
        if (identifier) {
          node[key] = identifier;
        }
      });
    };
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
        enter(path, state) {
          const { id } = _.assign(mapping, config(state.opts.id));
          if (!id) {
            throw new Error('Cannot find Lodash module');
          }
          if (!store.has(id)) {
            store.set(id);
          }
          // Clear tracked Lodash method imports and variables.
          importModule.cache.clear();
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

        const defaultMap = pkgStore.get('default');
        const memberMap = pkgStore.get('member');

        // Remove the original import node to be replaced.
        path.remove();

        // Track all the Lodash default and specifier imports in the source.
        _.each(node.specifiers, spec => {
          const localName = spec.local.name;

          if (types.isImportSpecifier(spec)) {
            // Handle import specifier (i.e. `import {map} from 'lodash'`).
            const identifier = importModule(spec.imported.name, file, importBase, localName);
            memberMap.set(localName, identifier);
          }
          else {
            // Handle default specifier (i.e. `import _ from 'lodash'`).
            defaultMap.set(localName, true);
          }
        });
      },

      MemberExpression(path) {
        const { file } = path.hub;
        const { node } = path;
        const { object } = node;
        const pkgStore = store.getStoreBy('default', object.name);

        if (pkgStore) {
          const key = node.property.name;

          // Detect chaining via `_.chain`.
          if (key == 'chain') {
            throw new Error(CHAIN_ERROR);
          }
          const isFp = pkgStore.id == 'lodash/fp';
          const importBase = isFp ? 'fp' : '';

          // Transform `_.foo` to `_foo`.
          path.replaceWith(importModule(key, file, importBase));
        }
        else {
          // Allow things like `bind.placeholder = {}`.
          if (types.isIdentifier(object)) {
            const identifier = store.getValueBy('member', object.name);
            if (identifier) {
              node.object = identifier;
            }
          }
        }
      },

      CallExpression(path) {
        const { node } = path;
        const { name } = node.callee;

        if (name) {
          const callee = store.getValueBy('member', name);
          if (callee) {
            // Update the import specifier if it's marked for replacement.
            node.callee = callee;
          } else if (isDefaultImport(name)) {
            // Detect chain sequences via _(value).
            throw new Error(CHAIN_ERROR);
          }
        }
        // Support lodash methods used as parameters (#11),
        // e.g. `_.flow(_.map, _.head)`.
        _.each(node.arguments, (arg, index, args) => {
          const { name } = arg;
          if (name) {
            // Assume that it's a placeholder (#33).
            args[index] = isDefaultImport(name)
              ? types.memberExpression(node.callee, types.identifier('placeholder'))
              : (store.getValueBy('member', name) || arg);
          }
        });
      },

      ExportNamedDeclaration(path) {
        const { node } = path;
        const { file } = path.hub;

        const pkgId = _.get(node, 'source.value');
        const pkgStore = store.get(pkgId);

        const isFp = pkgId == 'lodash/fp';
        const importBase = isFp ? 'fp' : '';

        node.source = null;

        _.each(node.specifiers, spec => {
          const localName = spec.local.name;
          spec.local = pkgStore
            ? importModule(localName, file, importBase)
            : (store.getValueBy('member', localName) || spec.local);
        });
      },

      // Various other (less common) ways to use a lodash specifier. This code
      // doesn't apply to uses on a lodash object only directly imported specifiers.

      // See #34.
      'Property': buildDeclaratorHandler('value'),
      'VariableDeclarator': buildDeclaratorHandler('init'),

      // Allow things like `o.a = _.noop`.
      'AssignmentExpression': buildExpressionHandler(['right']),

      // Allow things like `var x = y || _.noop`. See #28.
      'LogicalExpression': buildExpressionHandler(['left', 'right']),

      // Allow things like `var x = y ? _.identity : _.noop`. See #28.
      'ConditionalExpression': buildExpressionHandler(['test', 'consequent', 'alternate'])
    }
  };
};
