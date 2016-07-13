import _ from 'lodash';
import config from './config';
import importModule from './importModule';
import mapping from './mapping';
import Store from './Store';

/** The error message used when chain sequences are detected. */
const CHAIN_ERROR = [
  'Lodash chain sequences are not supported by babel-plugin-lodash.',
  'Consider substituting chain sequences with composition patterns.',
  'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'
].join('\n');

/*----------------------------------------------------------------------------*/

export default function lodash({ types }) {

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
  const store = new Store(mapping.ids.concat('lodash/fp'));

  function getCallee(path) {
    let result;
    let { parent } = path;

    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (types.isCallExpression(parent)) {
      parent = result = parent.callee;
    }
    return result;
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

  const replaceNode = _.curry((key, path) => {
    const object = path.node;
    const node = object[key];
    if (isIdentifier(node, path)) {
      object[key] = store.getValueBy('member', node.name);
    }
  });

  const replaceNodes = _.curry((props, path) => {
    _.each(props, key => replaceNode(key, path));
  });

  const replaceNodeList = _.curry((key, callee, path) => {
    const nodes = path.node[key];
    const placeholder = callee
      ? types.memberExpression(callee, identifiers.PLACEHOLDER)
      : identifiers.UNDEFINED;

    _.each(nodes, (node, index) => {
      if (isIdentifier(node, path)) {
        // Assume default members are placeholders.
        nodes[index] = isDefaultMember(node.name)
          ? placeholder
          : store.getValueBy('member', node.name);
      }
    });
  });

  const replaceElements = replaceNodeList('elements');
  const replaceArguments = replaceNodeList('arguments');

  /*--------------------------------------------------------------------------*/

  const visitor = {

    Program(path, state) {
      const { ids } = _.assign(mapping, config(state.opts));
      if (_.isEmpty(ids)) {
        throw new Error('Cannot find Lodash module');
      }
      _.each(ids, id => store.set(id));

      // Clear tracked Lodash method imports and variables.
      importModule.cache.clear();
      store.clear();
    },

    ImportDeclaration(path) {
      const { node } = path;
      const pkgStore = store.get(node.source.value);

      if (!pkgStore) {
        return;
      }
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
          const identifier = importModule(pkgStore, spec.imported.name, path.hub.file);

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

    ArrayExpression(path) {
      // Detect lodash callees to use as argument placeholders.
      const callee = getCallee(path);
      const name = callee ? (store.getValueBy('identifier', callee.name) || callee.name) : '';
      replaceElements(store.getValueBy('member', name), path);
    },

    MemberExpression(path) {
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
        path.replaceWith(importModule(pkgStore, property.name, path.hub.file));
      }
      else {
        // Allow things like `_bind.placeholder = {}`.
        node.object = store.getValueBy('member', object.name);
      }
    },

    CallExpression(path) {
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
      else if (types.isBindExpression(callee)) {
        visitor.CallExpression(path.get('callee'));
      }
      else if (types.isMemberExpression(callee)) {
        visitor.MemberExpression(path.get('callee'));
      }
      // Replace lodash references in arguments, e.g. `_.flow(_.map, _.head)`.
      replaceArguments(node.callee, path);
    },

    ExportNamedDeclaration(path) {
      const { node } = path;
      const pkgPath = _.get(node, 'source.value');
      const pkgStore = store.get(pkgPath);

      if (pkgStore) {
        node.source = null;
      }
      _.each(node.specifiers, spec => {
        const { local } = spec;
        if (pkgStore) {
          spec.local = importModule(pkgStore, local.name, path.hub.file);
        } else if (isIdentifier(spec.local, path)) {
          spec.local = store.getValueBy('member', local.name);
        }
      });
    },

    // Various other less common ways to use a lodash specifier.

    // Allow things like `o.x = _.noop`.
    'AssignmentExpression': replaceNode('right'),

    // Allow things like `var x = y ? y : _.noop`.
    'ConditionalExpression': replaceNodes(['test', 'consequent', 'alternate']),

    // Allow things like `_.noop`.
    'ExpressionStatement': replaceNode('expression'),

    // Allow things like `<div onClick={_.noop} />`.
    'JSXExpressionContainer': replaceNode('expression'),

    // Allow things like `var x = y || _.noop`.
    'LogicalExpression': replaceNodes(['left', 'right']),

    // Allow things like `var o = { 'x': _.noop }`.
    'ObjectProperty': replaceNode('value'),

    // Allow things like `var x = _.noop`.
    'VariableDeclarator': replaceNode('init')
  };

  return { visitor };
};
