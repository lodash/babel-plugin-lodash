import _ from 'lodash';
import { addDefault } from "babel-helper-module-imports";
import mapping from './mapping';

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore, name, path) {
  let { base, id } = pkgStore;
  const module = mapping.modules.get(id);
  const nameCases = [name.toLowerCase(), _.kebabCase(name), _.snakeCase(name)];
  let realName = _.find(nameCases, n => module.get(base).has(n));
  
  if (!realName) {
    base = base ? '' : module.findKey(map => realName = _.find(nameCases, n => map.has(n)));
    if (!base) {
      throw path.buildCodeFrameError([
        `The '${ id }' method \`${ name }\` is not a known module.`,
        'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
      ].join('\n'));
    }
  }
  return id + '/' + (base ? base + '/' : '') + module.get(base).get(realName);
}

function importModule(pkgStore, name, path) {
  return addDefault(path, resolvePath(pkgStore, name, path), { nameHint: name });
}

export default _.memoize(importModule, (pkgStore, name) => (pkgStore.path + '/' + name).toLowerCase());
