import _ from 'lodash';
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
  const modulePath = getModulePath(id);
  if (modulePath) {
    ids.push(id);
    modules.set(id, createModuleMap(modulePath));
  }
}, new MapCache);

/*----------------------------------------------------------------------------*/

function createModuleMap(modulePath) {
  const basePaths = modulePath ? glob.sync(path.join(modulePath, '**/')) : [];
  return _.reduce(basePaths, (result, basePath) => {
    const base = path.relative(modulePath, basePath);
    const filenames = glob.sync(path.join(basePath, '*.js'));
    const names = filenames.map(filename => path.basename(filename, '.js'));
    return result.set(base, new Set(names));
  }, new MapCache);
}

function getModulePath(id, from=process.cwd()) {
  try {
    return path.dirname(Module._resolveFilename(id, _.assign(new Module, {
      'paths': Module._nodeModulePaths(from)
    })));
  } catch (e) {}
  return '';
}

function config({ cwd=process.cwd(), id=ids[0] } = {}) {
  _.each(_.castArray(id), id => {
    if (!modules.get(id)) {
      ids.push(id);
      modules.set(id, createModuleMap(getModulePath(id, cwd)));
    }
  });
  return { ids, modules };
}

export default config;
