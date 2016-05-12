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

export default function({ types: types }) {

  const identifiers = {
    'PLACEHOLDER': types.identifier('placeholder'),
    'UNDEFINED': types.identifier('undefined')
  };

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
      const decNode = node[key];
      if (isIdentifier(decNode, path)) {
        node[key] = store.getValueBy('member', decNode.name);
      }
    };
  }

  function buildExpressionHandler(props) {
    return function(path) {
      const { node } = path;
      _.each(props, key => {
        const expNode = node[key];
        if (isIdentifier(expNode, path)) {
          node[key] = store.getValueBy('member', expNode.name);
        }
      });
    };
  }

  function getCallee(path) {
    let result;
    let { parent } = path;

    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (types.isCallExpression(parent)) {
      parent = result = parent.callee;
    }
    return result;
  }

  function getImportBase(pkgStore) {
    return _.get(pkgStore, 'id') == 'lodash/fp' ? 'fp' : '';
  }

  function isDefaultMember(name) {
    return !!store.getStoreBy('default', name);
  }

  function isIdentifier(node, path) {
    if (types.isIdentifier(node)) {
      const parent = _.get(path.scope.getAllBindings(), [node.name, 'path', 'parent']);
      return isImportDeclaration(parent);
    }
    return false;
  }

  function isImportDeclaration(node) {
    return types.isImportDeclaration(node) && store.has(node.source.value);
  }

  function replaceElements(elements, path, callee) {
    const placeholder = callee
      ? types.memberExpression(callee, identifiers.PLACEHOLDER)
      : identifiers.UNDEFINED;

    _.each(elements, (element, index) => {
      if (isIdentifier(element, path)) {
        // Assume default members are placeholders.
        elements[index] = isDefaultMember(element.name)
          ? placeholder
          : store.getValueBy('member', element.name);
      }
    });
  }

  /*--------------------------------------------------------------------------*/

  const visitor = {

    Program(path, state) {
      const { id } = _.assign(mapping, config(state.opts));
      if (!id) {
        throw new Error('Cannot find Lodash module');
      }
      if (!store.has(id)) {
        store.set(id);
      }
      // Clear tracked Lodash method imports and variables.
      importModule.cache.clear();
      store.clear();
    },

    ImportDeclaration(path) {
      const { file } = path.hub;
      const { node } = path;
      const { value: pkgId } = node.source;
      const pkgStore = store.get(pkgId);

      if (!pkgStore) {
        return;
      }
      const importBase = getImportBase(pkgStore);
      const defaultMap = pkgStore.get('default');
      const identifierMap = pkgStore.get('identifier');
      const memberMap = pkgStore.get('member');

      // Remove the original import node.
      path.remove();

      // Track all the Lodash default and specifier imports in the source.
      _.each(node.specifiers, spec => {
        const { local } = spec;
        if (types.isImportSpecifier(spec)) {
          // Replace member import, e.g. `import { map } from 'lodash'`, with
          // cherry-picked default import, e.g. `import _map from 'lodash/map'`.
          const identifier = importModule(spec.imported.name, file, importBase, local.name);

          identifierMap.set(identifier.name, local.name);
          memberMap.set(identifier.name, identifier);
          memberMap.set(local.name, identifier);
        }
        else {
          // Cache original default member name, e.g. `_` of `import _ from 'lodash'`.
          defaultMap.set(local.name, true);
          memberMap.set(local.name, identifiers.UNDEFINED);
        }
      });
    },

    MemberExpression(path) {
      const { file } = path.hub;
      const { node } = path;
      const { object, property } = node;

      if (!isIdentifier(object, path)) {
        return;
      }
      const pkgStore = store.getStoreBy('default', object.name);
      if (pkgStore) {
        if (property.name == 'chain') {
          throw new Error(CHAIN_ERROR);
        }
        // Replace `_.map` with `_map`.
        path.replaceWith(importModule(property.name, file, getImportBase(pkgStore)));
      }
      else {
        // Allow things like `_bind.placeholder = {}`.
        node.object = store.getValueBy('member', object.name);
      }
    },

    CallExpression(path) {
      const { file } = path.hub;
      const { node } = path;
      const { callee } = node;

      if (isIdentifier(callee, path)) {
        if (isDefaultMember(callee.name)) {
          // Detect chain sequences by `_()`.
          throw new Error(CHAIN_ERROR);
        }
        // Replace `map()` with `_map()`.
        node.callee = store.getValueBy('member', callee.name);
      }
      else if (types.isMemberExpression(callee)) {
        visitor.MemberExpression(path.get('callee'));
      }
      // Replace lodash in arguments, e.g. `_.flow(_.map, _.head)`.
      replaceElements(node.arguments, path, node.callee);
    },

    ArrayExpression(path) {
      // Detect lodash callees to use as argument placeholders.
      const callee = getCallee(path);
      const name = callee ? (store.getValueBy('identifier', callee.name) || callee.name) : '';
      replaceElements(path.node.elements, path, store.getValueBy('member', name));
    },

    ExportNamedDeclaration(path) {
      const { node } = path;
      const { file } = path.hub;
      const pkgId = _.get(node, 'source.value');
      const pkgStore = store.get(pkgId);
      const importBase = getImportBase(pkgStore);

      if (pkgStore) {
        node.source = null;
      }
      _.each(node.specifiers, spec => {
        const { local } = spec;
        if (pkgStore) {
          spec.local = importModule(local.name, file, importBase);
        } else if (isIdentifier(spec.local, path)) {
          spec.local = store.getValueBy('member', local.name);
        }
      });
    },

    // Various other (less common) ways to use a lodash specifier. This code
    // doesn't apply to uses on a lodash object, only directly imported specifiers.
    'Property': buildDeclaratorHandler('value'),
    'VariableDeclarator': buildDeclaratorHandler('init'),

    // Allow things like `o.a = _.noop`.
    'AssignmentExpression': buildExpressionHandler(['right']),

    // Allow things like `var x = y || _.noop`.
    'LogicalExpression': buildExpressionHandler(['left', 'right']),

    // Allow things like `var x = y ? _.identity : _.noop`.
    'ConditionalExpression': buildExpressionHandler(['test', 'consequent', 'alternate'])
  };

  return { visitor };
};
