import resolveModule from './lodash-modules';

export default function({ Plugin, types: t }) {
  // Track the variables used to import lodash
  let lodashs = Object.create(null);
  let specified = Object.create(null);

  // Track the methods that have already been used to prevent dupe imports
  let selectedMethods = Object.create(null);

  // Import a lodash method and return the computed import identifier
  function importMethod(methodName, file) {
    if (!selectedMethods[methodName]) {
      let path = resolveModule(methodName);
      selectedMethods[methodName] = file.addImport(path, '_' + methodName);
    }
    return selectedMethods[methodName];
  }

  return new Plugin("lodash", {

    visitor: {
      ImportDeclaration(node, parent, scope) {
        if (node.source.value === 'lodash') {
          node.specifiers.forEach(spec => {
            if (t.isImportSpecifier(spec)) {
              specified[spec.local.name] = spec.imported.name;
            } else {
              lodashs[spec.local.name] = true;
            }
          });
          this.dangerouslyRemove();
        }
      },

      CallExpression(node, parent, scope, file) {
        let {name} = node.callee;
        if (!t.isIdentifier(node.callee)) return;
        if (specified[name]) {
          node.callee = importMethod(specified[name], file);
          return node;
        }
        // Detect chaining
        else if (lodashs[name]) {
          throw new Error(`lodash chaining syntax is not yet supported`);
        }
      },

      MemberExpression(node, parent, scope, file) {
        if (!lodashs[node.object.name]) return;

        // _.foo() -> _foo()
        return importMethod(node.property.name, file);
      },

      exit(node) {
        if (!t.isProgram(node)) return;
        // Clean up tracking variables
        lodashs = Object.create(null);
        specified = Object.create(null);
        selectedMethods = Object.create(null);
      }
    }

  });
}
