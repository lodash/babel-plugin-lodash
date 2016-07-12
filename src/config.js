import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import MapCache from './MapCache';
import Module from 'module';
import path from 'path';

const defaultIds = [
  'lodash',
  'lodash-es',
  'lodash-compat'
];

const ids = [];

const modules = _.transform(defaultIds, (modules, id) => {
  const moduleRoot = getModuleRoot(id);
  if (moduleRoot) {
    ids.push(id);
    modules.set(id, createModuleMap(moduleRoot));
  }
}, new MapCache);

/*----------------------------------------------------------------------------*/

function createModuleMap(moduleRoot) {
  const basePaths = moduleRoot ? glob.sync(path.join(moduleRoot, '**/')) : [];
  return _.reduce(basePaths, (result, basePath) => {
    const base = path.relative(moduleRoot, basePath);
    const filePaths = glob.sync(path.join(basePath, '*.js'));
    const pairs = filePaths.map(filePath => {
      const name = path.basename(filePath, '.js');
      return [name.toLowerCase(), name];
    });
    return result.set(base, new MapCache(pairs));
  }, new MapCache);
}

function getModuleRoot(id, from=process.cwd()) {
  try {
    const dirs = path.dirname(Module._resolveFilename(id, _.assign(new Module, {
      'paths': Module._nodeModulePaths(from)
    }))).split(path.sep);

    if (dirs[0] == '') {
      dirs[0] = path.sep;
    }
    let { length:index } = dirs;
    while (index--) {
      const dirSub  = dirs.slice(0, index + 1);
      const dirPath = dirSub.join('/');
      const pkgPath = path.join(dirPath, 'package.json');

      if (dirs[index - 1] === 'node_modules' ||
          (fs.existsSync(pkgPath) && require(pkgPath).name == id)) {
        return dirPath;
      }
    }
    return dirs.join('/');
  } catch (e) {}
  return '';
}

function config({ cwd=process.cwd(), id=ids[0] } = {}) {
  _.each(_.castArray(id), id => {
    if (!modules.get(id)) {
      ids.push(id);
      modules.set(id, createModuleMap(getModuleRoot(id, cwd)));
    }
  });
  return { ids, modules };
}

export default config;
