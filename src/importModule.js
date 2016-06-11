import _ from 'lodash';
import mapping from './mapping';

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore, name) {
  let { base, id } = pkgStore;
  const module = mapping.modules.get(id);

  if (!module.get(base).has(name)) {
    base = (base || (id == 'lodash' && module.has('fp')))
      ? ''
      : module.findKey(set => set.has(name));

    if (!base) {
      throw new Error([
        `The '${ id }' method ${ name } is not a known module.`,
        'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
      ].join('\n'));
    }
  }
  return id + '/' + (base ? base + '/' : '') + name;
}

function importModule(pkgStore, name, file) {
  return file.addImport(resolvePath(pkgStore, name), 'default', name);
}

export default _.memoize(importModule, (pkgStore, name) => pkgStore.path + '/' + name);
