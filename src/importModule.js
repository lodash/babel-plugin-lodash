'use strict';

import _ from 'lodash';
import mapping from './mapping';

/*----------------------------------------------------------------------------*/

function resolveModule(name, base='') {
  if (!mapping.moduleMap.get(base).has(name)) {
    throw new Error([
      `Lodash method ${ name } is not a known module.`,
      'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
    ].join('\n'));
  }
  return mapping.lodashId + (base ? '/' + base : '') + '/' + name;
}

function importModule(name, file, base='', importName=name) {
  const importPath = resolveModule(name, base);
  return file.addImport(importPath, 'default', importName);
}

export default _.memoize(importModule, function(name, file, base) {
  return (base ? base + '/' : '') + name;
});
