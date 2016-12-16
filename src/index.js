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

  const visitor = {
    Program(path, state) {
      const { ids } = _.assign(mapping, config(state.opts));
      const { file } = path.hub;

      // Clear tracked method imports.
      importModule.cache.clear();
      store.clear();

      // Populate module paths per package.
      _.each(ids, id => {
        store.set(id);
        mapping.modules.get(id).forEach(function(value, key) {
          store.set(id + '/' + key);
        });
      });

      // Replace old members with their method imports.
      _.each(file.metadata.modules.imports, module => {
        const pkgStore = store.get(module.source);
        if (!pkgStore) {
          return;
        }
        const isLodash = pkgStore.isLodash();
        const specs = _.sortBy(module.specifiers, spec => spec.imported == 'default');

        _.each(specs, spec => {
          const { imported, local } = spec;
          const binding = file.scope.getBinding(local);
          const { importKind = 'value' } = binding.path.parent;

          // Skip type annotation imports.
          if (importKind != 'value') {
            return false;
          }
          const isChain = isLodash && imported == 'chain';

          _.each(binding.referencePaths, refPath => {
            const { node, parentPath } = refPath;
            const { type } = node;

            if (imported && imported != 'default') {
              if (isChain && refPath.parentPath.isCallExpression()) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              const { name } = importModule(pkgStore, imported, refPath);
              refPath.replaceWith({ type, name });
            }
            else if (parentPath.isMemberExpression()) {
              const key = refPath.parent.property.name;
              if (isLodash && key == 'chain' && parentPath.parentPath.isCallExpression()) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              const { name } = importModule(pkgStore, key, refPath);
              parentPath.replaceWith({ type, name });
            }
            else if (isLodash) {
              const callee = getCallee(refPath);
              if (callee && callee.name == local) {
                throw refPath.buildCodeFrameError(CHAIN_ERROR);
              }
              refPath.replaceWith(callee
                ? types.memberExpression(callee, identifiers.PLACEHOLDER)
                : identifiers.UNDEFINED
              );
            }
          });
        });
      });
    },

    ImportDeclaration(path) {
      if (store.get(path.node.source.value)) {
        // Remove old import.
        path.remove();
      }
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
        spec.local = importModule(pkgStore, spec.local.name, path);
      });
    }
  };

  return { visitor };
};
