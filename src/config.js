import _ from 'lodash';
import glob from 'glob';
import MapCache from './MapCache';
import Module from 'module';
import path from 'path';

const defaultPath = _.toString(_.find([
  getModulePath('lodash'),
  getModulePath('lodash-es'),
  getModulePath('lodash-compat')
]));

const defaultId = path.basename(defaultPath);

const moduleMaps = new MapCache;

/*----------------------------------------------------------------------------*/

function createModuleMap(modulePath) {
  const basePaths = [modulePath]
    .concat(glob.sync(path.join(modulePath, '*/')));

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

function config(id=defaultId) {
  const modulePath = getModulePath(id);
  if (!modulePath) {
    return {};
  }
  const module = moduleMaps.get(id) || createModuleMap(modulePath);
  moduleMaps.set(id, module);
  return { id, module };
}

export default _.memoize(config);
