'use strict';

import _ from 'lodash';
import mapping from './mapping';

const lodashId = mapping.lodashId;
const moduleMap = mapping.moduleMap;

/*----------------------------------------------------------------------------*/

function resolveModule(name, base='') {
  base = base
    ? (_.includes(moduleMap.get(base), name) ? base : undefined)
    : _.nth(_.find(_.toArray(moduleMap), entry => _.includes(entry[1], name)), 0);

  if (base === undefined) {
    throw new Error([
      `Lodash method ${name} is not a known module.`,
      'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
    ].join('\n'));
  }
  return lodashId + (base ? '/' + base : '') + '/' + name;
}

export default _.memoize(resolveModule, function(name, base) {
  return (base ? base + '/' : '') + name;
});
