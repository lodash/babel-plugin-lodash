'use strict';

import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import Module from 'module';
import path from 'path';

const lodashPath = path.dirname(Module._resolveFilename('lodash', _.assign(new Module, {
  'paths': Module._nodeModulePaths(process.cwd())
})));

const basePaths = [lodashPath].concat(glob.sync(path.join(lodashPath, '*/')));

const moduleMap = _.transform(basePaths, (map, basePath) => {
  const filenames = glob.sync(path.join(basePath, '*.js'));
  const base = path.relative(lodashPath, basePath);
  const names = filenames.map(filename => path.basename(filename, '.js'));
  return map.set(base, names);
}, new Map);

export default function resolveModule(name, base='') {
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
