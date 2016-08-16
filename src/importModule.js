import _ from 'lodash';
import mapping from './mapping';

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore, name, path) {
  let { base, id } = pkgStore;
  const lower = name.toLowerCase();
  const module = mapping.modules.get(id);

  if (!module.get(base).has(lower)) {
    base = base ? '' : module.findKey(map => map.has(lower));
    if (!base) {
      throw path.buildCodeFrameError([
        `The '${ id }' method '${ name }' is not a known module.`,
        'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
      ].join('\n'), Error);
    }
  }
  return id + '/' + (base ? base + '/' : '') + module.get(base).get(lower);
}

function importModule(pkgStore, name, file, path) {
  return file.addImport(resolvePath(pkgStore, name, path), 'default', name);
}

export default _.memoize(importModule, (pkgStore, name) => (pkgStore.path + '/' + name).toLowerCase());
