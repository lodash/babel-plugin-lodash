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

  function importer(file, defaults, members) {
    _.each(members, ({ pkgStore, imported, local }) => {
      const binding = file.scope.getBinding(local);
      const module = importModule(pkgStore, imported, file);
      const isLodash = pkgStore.isLodash();

      pkgStore.set(local, module);
      pkgStore.set(module, module);

      // Replace references with their modular versions.
      _.each(binding.referencePaths, path => {
        if (isLodash && local == 'chain' && path.parentPath.isCallExpression()) {
          throw path.buildCodeFrameError(CHAIN_ERROR);
        }
        path.replaceWith(types.identifier(module));
      });
    });

    _.each(defaults, ({ pkgStore, local }) => {
      const binding = file.scope.getBinding(local);
      const isLodash = pkgStore.isLodash();

      _.each(binding.referencePaths, path => {
        const { parentPath } = path;

        if (parentPath.isMemberExpression()) {
          const key = path.parent.property.name;
          if (isLodash && key == 'chain' && parentPath.parentPath.isCallExpression()) {
            throw path.buildCodeFrameError(CHAIN_ERROR);
          }
          // Import module.
          const module = importModule(pkgStore, key, file);
          pkgStore.set(key, module);
          pkgStore.set(module, module);

          // Replace reference with its modular version.
          parentPath.replaceWith(types.identifier(module));
        }
        else if (isLodash) {
          const callee = getCallee(path);
          if (callee && callee.name == local) {
            throw path.buildCodeFrameError(CHAIN_ERROR);
          }
          path.replaceWith(callee
            ? types.memberExpression(callee, types.identifier('placeholder'))
            : types.identifier('undefined')
          );
        }
      });
    });
  }

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

      const defaults = [];
      const members = [];

      _.each(path.hub.file.metadata.modules.imports, module => {
        const pkgStore = store.get(module.source);
        if (!pkgStore) {
          return;
        }

        _.each(module.specifiers, (spec) => {
          const type = (spec.imported === 'default') ? defaults : members;
          type.push({
            pkgStore,
            imported: spec.imported,
            local: spec.local,
          });
        });
      });
      importer(path.hub.file, defaults, members);
    },

    ImportDeclaration(path) {
      const { node } = path;
      const pkgStore = store.get(node.source.value);

      if (!pkgStore) {
        return;
      }
      path.remove();
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
        spec.local = types.identifier(
          importModule(pkgStore, spec.local.name, path.hub.file)
        );
      });
    }
  };

  return { visitor };
};
