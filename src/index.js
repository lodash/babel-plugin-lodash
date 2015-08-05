import resolveModule from './lodash-modules';

export default function({ Plugin, types: t }) {
  // function createImport(name, path) {
  //   return t.importDeclaration(
  //     [t.importDefaultSpecifier(name)],
  //     t.literal(path)
  //   );
  // }

  let lodashs = Object.create(null);
  let specified = Object.create(null);

  let selectedMethods = Object.create(null);

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      let path = resolveModule(methodName);
      selectedMethods[methodName] = file.addImport('_' + methodName, null, path);
    }
    return selectedMethods[methodName];
  }

  return new Plugin("babel-lodash-modularize", {

    visitor: {
      ImportDeclaration(node, parent, scope) {
        if (node.source.value === 'lodash') {
          node.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier') {
              specified[spec.local.name] = spec.imported.name;
            } else {
              lodashs[spec.local.name] = true;
            }
          });
          this.dangerouslyRemove();
        }
      },

      CallExpression(node, parent, scope, file) {
        let {name, type} = node.callee;
        if (type !== 'Identifier') return;
        if (specified[name]) {
          node.callee = importMethod(name, file);
          return node;
        }
        // Detect chaining
        else if (lodashs[name]) {
          throw new Error(`lodash chaining syntax is not yet supported`);
        }
      },

      MemberExpression(node, parent, scope, file) {
        if (!lodashs[node.object.name]) return;

        // replace member expression with identifier
        // _.foo() -> _foo()
        return importMethod(node.property.name, file);
      },

      exit(node) {
        if (node.type !== 'Program') return;
        // Clean up tracking variables
        lodashs = Object.create(null);
        specified = Object.create(null);
        selectedMethods = Object.create(null);
      }
    }
  });
}
