'use strict';

import _ from 'lodash';
import mapping from './mapping';

const lodashId = mapping.lodashId;
const moduleMap = mapping.moduleMap;

/*----------------------------------------------------------------------------*/

function resolveModule(name, base='') {
  if (!_.includes(moduleMap.get(base), name)) {
    throw new Error([
      `Lodash method ${ name } is not a known module.`,
      'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
    ].join('\n'));
  }
  return lodashId + (base ? '/' + base : '') + '/' + name;
}

function importModule(name, file, base='', importName=name) {
  const importPath = resolveModule(name, base);
  return file.addImport(importPath, 'default', importName);
}

export default _.memoize(importModule, function(name, file, base) {
  return (base ? base + '/' : '') + name;
});
