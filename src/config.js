'use strict';

import _ from 'lodash';
import glob from 'glob';
import Module from 'module';
import path from 'path';

const defaultPath = getModulePath('lodash') || getModulePath('lodash-es');
const defaultId = path.basename(defaultPath);

/*----------------------------------------------------------------------------*/

function getModulePath(id, from=process.cwd()) {
  try {
    return path.dirname(Module._resolveFilename(id, _.assign(new Module, {
      'paths': Module._nodeModulePaths(from)
    })));
  } catch (e) {}
  return '';
}

function config(lodashId=defaultId) {
  const lodashPath = getModulePath(lodashId);
  const basePaths = lodashId ? [lodashPath].concat(glob.sync(path.join(lodashPath, '*/'))) : [];

  const moduleMap = _.transform(basePaths, (map, basePath) => {
    const filenames = glob.sync(path.join(basePath, '*.js'));
    const base = path.relative(lodashPath, basePath);
    const names = filenames.map(filename => path.basename(filename, '.js'));
    map.set(base, new Set(names));
  }, new Map);

  return {
    'id': lodashId,
    'module': moduleMap
  };
}

export default _.memoize(config);
