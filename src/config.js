import _ from 'lodash';
import MapCache from './MapCache';
import ModuleCache from './ModuleCache';

const defaultIds = [
  'lodash',
  'lodash-es',
  'lodash-compat'
];

const ids = [];
const modules = new MapCache;

/*----------------------------------------------------------------------------*/

export default function config({ cwd=process.cwd(), id=defaultIds }={}) {
  _.each(_.castArray(id), id => {
    if (!modules.get(id)) {
      const moduleRoot = ModuleCache.resolve(id, cwd);
      if (moduleRoot) {
        ids.push(id);
        modules.set(id, new ModuleCache(moduleRoot));
      }
    }
  });
  return { ids, modules };
};
