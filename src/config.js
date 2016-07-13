import _ from 'lodash';
import MapCache from './MapCache';
import ModuleCache from './ModuleCache';

const defaultIds = [
  'lodash',
  'lodash-es',
  'lodash-compat'
];

const ids = [];

const modules = _.transform(defaultIds, (modules, id) => {
  const moduleRoot = ModuleCache.resolve(id);
  if (moduleRoot) {
    ids.push(id);
    modules.set(id, new ModuleCache(moduleRoot));
  }
}, new MapCache);

/*----------------------------------------------------------------------------*/

export default function config({ cwd=process.cwd(), id=ids[0] }={}) {
  _.each(_.castArray(id), id => {
    if (!modules.get(id)) {
      ids.push(id);
      modules.set(id, new ModuleCache(ModuleCache.resolve(id, cwd)));
    }
  });
  return { ids, modules };
};
