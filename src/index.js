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

  function importer({ defaults, members }) {
    _.each(members, ({ pkgStore, specPath }) => {
      // Import module.
      const { node } = specPath;
      const name = node.local.name;
      const binding = specPath.scope.getBinding(name);
      const identifier = importModule(pkgStore, node.imported.name, specPath.hub.file);
      const isLodash = pkgStore.isLodash();

      // Replace the old member with its new identifier.
      _.each(binding.referencePaths, refPath => {
        if (isLodash && name == 'chain' && refPath.parentPath.isCallExpression()) {
          throw refPath.buildCodeFrameError(CHAIN_ERROR);
        }
        refPath.replaceWith(types.clone(identifier));
      });
    });

    _.each(defaults, ({ pkgStore, specPath }) => {
      const name = specPath.node.local.name;
      const binding = specPath.scope.getBinding(name);
      const isLodash = pkgStore.isLodash();

      _.each(binding.referencePaths, refPath => {
        const { parentPath } = refPath;

        if (parentPath.isMemberExpression()) {
          const key = refPath.parent.property.name;
          if (isLodash && key == 'chain' && parentPath.parentPath.isCallExpression()) {
            throw refPath.buildCodeFrameError(CHAIN_ERROR);
          }
          // Import and replace the old member with its new identifier.
          const identifier = importModule(pkgStore, key, refPath.hub.file);
          parentPath.replaceWith(types.clone(identifier));
        }
        else if (isLodash) {
          const callee = getCallee(refPath);
          if (callee && callee.name == name) {
            throw refPath.buildCodeFrameError(CHAIN_ERROR);
          }
          refPath.replaceWith(callee
            ? types.memberExpression(callee, identifiers.PLACEHOLDER)
            : identifiers.UNDEFINED
          );
        }
      });
    });
  }

  const importVisitor = {
    ImportDeclaration(path) {
      const pkgStore = store.get(path.node.source.value);

      if (!pkgStore) {
        return;
      }
      _.each(path.get('specifiers'), specPath => {
        const key = specPath.isImportSpecifier() ? 'members' : 'defaults';
        this[key].push({ pkgStore, specPath });
      });
      // Remove old import.
      path.remove();
    }
  };

  const visitor = {
    Program(path, state) {
      const { ids } = _.assign(mapping, config(state.opts));
      if (_.isEmpty(ids)) {
        throw new Error('Cannot find module');
      }
      // Clear tracked method imports and variables.
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
