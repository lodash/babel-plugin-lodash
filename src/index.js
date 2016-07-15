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
  const store = new Store;

  function getCallee({ parentPath }) {
    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (!parentPath.isStatement()) {
      if (parentPath.isCallExpression()) {
        let result = parentPath.node.callee;
        while (types.isCallExpression(result)) {
          result = result.callee;
        }
        return result;
      }
      parentPath = parentPath.parentPath;
    }
  }

  /*--------------------------------------------------------------------------*/

  function importer({ declarations, defaults, members }) {
    _.each(members, ({ pkgStore, spec }) => {
      // Import module.
      const { node } = spec;
      const name = node.local.name;
      const binding = spec.scope.getBinding(name);
      const identifier = importModule(pkgStore, node.imported.name, spec.hub.file);
      const isLodash = pkgStore.isLodash();

      // Replace references with their modular versions.
      _.each(binding.referencePaths, path => {
        if (isLodash && name == 'chain' && path.parentPath.isCallExpression()) {
          throw path.buildCodeFrameError(CHAIN_ERROR);
        }
        path.replaceWith(types.clone(identifier));
      });
    });

    _.each(defaults, ({ pkgStore, spec }) => {
      const name = spec.node.local.name;
      const binding = spec.scope.getBinding(name);
      const isLodash = pkgStore.isLodash();

      _.each(binding.referencePaths, path => {
        const { parentPath } = path;

        if (parentPath.isMemberExpression()) {
          const key = path.parent.property.name;
          if (isLodash && key == 'chain' && parentPath.parentPath.isCallExpression()) {
            throw path.buildCodeFrameError(CHAIN_ERROR);
          }
          // Import module.
          const identifier = importModule(pkgStore, key, path.hub.file);

          // Replace reference with its modular version.
          parentPath.replaceWith(types.clone(identifier));
        }
        else if (isLodash) {
          const callee = getCallee(path);
          if (callee && callee.name == name) {
            throw path.buildCodeFrameError(CHAIN_ERROR);
          }
          path.replaceWith(callee
            ? types.memberExpression(callee, identifiers.PLACEHOLDER)
            : identifiers.UNDEFINED
          );
        }
      });
    });

    // Remove old imports.
    _.invokeMap(declarations, 'remove');
  }

  const importVisitor = {
    ImportDeclaration(path) {
      const { node } = path;
      const pkgStore = store.get(node.source.value);

      if (!pkgStore) {
        return;
      }
      this.declarations.push(path);
      _.each(path.get('specifiers'), spec => {
        const key = spec.isImportSpecifier() ? 'members' : 'defaults';
        this[key].push({ pkgStore, spec });
      });
    }
  };

  const visitor = {
    Program(path, state) {
      const { ids } = _.assign(mapping, config(state.opts));
      if (_.isEmpty(ids)) {
        throw new Error('Cannot find module');
      }
      // Clear tracked Lodash method imports and variables.
      importModule.cache.clear();
      store.clear();

      // Populate module paths per package.
      _.each(ids, id => {
        store.set(id);
        mapping.modules.get(id).forEach(function(value, key) {
          store.set(id + '/' + key);
        });
      });

      const imports = {
        'declarations': [],
        'defaults': [],
        'members': []
      };

      path.traverse(importVisitor, imports);
      importer(imports);
    },

    ExportNamedDeclaration(path) {
      const { node } = path;
      const pkgPath = _.get(node, 'source.value');
      const pkgStore = store.get(pkgPath);

      if (!pkgStore) {
        return;
      }
      node.source = null;

      _.each(node.specifiers, spec => {
        spec.local = importModule(pkgStore, spec.local.name, path.hub.file);
      });
    }
  };

  return { visitor };
};
