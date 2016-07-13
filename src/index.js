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

  function getCallee(path) {
    let { parentPath } = path;

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
    // Phase 1: Import all modules.

    _.each(members, ({ pkgStore, spec }) => {
      const { node } = spec;
      const name = node.local.name;

      if (name === 'chain') {
        throw path.buildCodeFrameError(CHAIN_ERROR);
      }

      const identifier = importModule(pkgStore, node.imported.name, spec.hub.file);
      pkgStore.set(name, identifier);
      pkgStore.set(identifier.name, identifier);
    })
    _.each(defaults, ({ pkgStore, spec }) => {
        const binding = spec.scope.getBinding(spec.node.local.name);
        _.each(binding.referencePaths, path => {
          if (path.key === 'callee') {
            throw path.buildCodeFrameError(CHAIN_ERROR);
          } else if (path.parentPath.isMemberExpression()) {
            const name = path.parent.property.name;

            if (name === 'chain') {
              throw path.buildCodeFrameError(CHAIN_ERROR);
            }

            if (!pkgStore.has(name)) {
              const identifier = importModule(pkgStore, name, path.hub.file);
              pkgStore.set(name, identifier);
              pkgStore.set(identifier.name, identifier);
            }
          }
        });
    });

    // Phase 2: Replace all uses with their modularized version.
    _.each(members, ({ pkgStore, spec }) => {
      const name = spec.node.local.name;

      const identifier = pkgStore.get(name);
      const binding = spec.scope.getBinding(name);
      _.each(binding.referencePaths, path => {
        path.replaceWith(identifier);
      });
    })
    _.each(defaults, ({ pkgStore, spec }) => {
      const binding = spec.scope.getBinding(spec.node.local.name);
      _.each(binding.referencePaths, path => {
        const { parentPath, node } = path;

        if (parentPath.isMemberExpression()) {
          const name = path.parent.property.name;
          parentPath.replaceWith(pkgStore.get(name));
        } else {
          const callee = getCallee(path);
          if (callee && pkgStore.has(callee.name)) {
            path.replaceWith(types.memberExpression(
              callee,
              types.identifier('placeholder')
            ));
          } else {
            throw path.buildCodeFrameError('wtf');
          }
        }
      });
    });

    // Phase 3: Remove the old imports.
    _.each(declarations, (dec) => dec.remove());
  }

  const importVisitor = {
    ImportDeclaration(path) {
      const { node } = path;
      const pkgStore = store.get(node.source.value);

      if (!pkgStore) {
        return;
      }

      this.declarations.push(path);
      _.each(path.get("specifiers"), (spec) => {
        if (spec.isImportSpecifier()) {
          this.members.push({ pkgStore, spec });
        } else {
          this.defaults.push({ pkgStore, spec });
        }
      });
    }
  };

  const visitor = {
    Program(path, state) {
      const { ids } = _.assign(mapping, config(state.opts));
      if (_.isEmpty(ids)) {
        throw new Error('Cannot find module');
      }
      _.each(ids, id => {
        store.set(id);
        mapping.modules.get(id).forEach(function(value, key) {
          store.set(id + '/' + key);
        });
      });

      // Clear tracked Lodash method imports and variables.
      importModule.cache.clear();
      store.clear();

      const imports = {
        defaults: [],
        members: [],
        declarations: [],
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
