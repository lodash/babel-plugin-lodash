import _ from 'lodash';
import mapping from './mapping';

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore, name) {
  let { base, id } = pkgStore;
  const lower = name.toLowerCase();
  const module = mapping.modules.get(id);

  if (!module.get(base).has(lower)) {
    base = base ? '' : module.findKey(map => map.has(lower));
    if (!base) {
      throw new Error([
        `The '${ id }' method ${ name } is not a known module.`,
        'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
      ].join('\n'));
    }
  }
  return id + '/' + (base ? base + '/' : '') + module.get(base).get(lower);
}

function importModule(pkgStore, name, file) {
  return file.addImport(resolvePath(pkgStore, name), 'default', name).name;
}

export default _.memoize(importModule, (pkgStore, name) => pkgStore.path + '/' + name);
