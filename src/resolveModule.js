'use strict';

import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import Module from 'module';
import path from 'path';

const lodashPath = getModulePath('lodash') || getModulePath('lodash-es');

if (!lodashPath) {
  throw new Error("Cannot find module 'lodash' or 'lodash-es'");
}

const basePaths = [lodashPath].concat(glob.sync(path.join(lodashPath, '*/')));

const moduleMap = _.transform(basePaths, (map, basePath) => {
  const filenames = glob.sync(path.join(basePath, '*.js'));
  const base = path.relative(lodashPath, basePath);
  const names = filenames.map(filename => path.basename(filename, '.js'));
  map.set(base, names);
}, new Map);

/*----------------------------------------------------------------------------*/

function getModulePath(id, from=process.cwd()) {
  try {
    return path.dirname(Module._resolveFilename(id, _.assign(new Module, {
      'paths': Module._nodeModulePaths(from)
    })));
  } catch (e) {}
  return '';
}

function resolveModule(name, base='') {
  base = base
    ? (_.includes(moduleMap.get(base), name) && base)
    : _.nth(_.find(_.toArray(moduleMap), entry => _.includes(entry[1], name)), 0);

  if (base !== undefined) {
    return path.join('lodash', base, name);
  }
  throw new Error([
    `Lodash method ${name} is not a known module.`,
    'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
  ].join('\n'));
}

export default _.memoize(resolveModule, function(name, base) {
  return (base ? (base + '/') : '') + name;
});
