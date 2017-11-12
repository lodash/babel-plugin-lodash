import _ from 'lodash'
import { addDefault } from "babel-helper-module-imports"
import mapping from './mapping'

/*----------------------------------------------------------------------------*/

function resolvePath(pkgStore, name, path) {
  let { base, id } = pkgStore
  const lower = name.toLowerCase()
  const module = mapping.modules.get(id)

  if (! module.get(base).has(lower)) {
    base = base ? '' : module.findKey(map => map.has(lower))

    if (! base) {
      throw path.buildCodeFrameError([
        `The '${ id }' method \`${ name }\` is not a known module.`,
        'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
      ].join('\n'))
    }
  }

  return id + '/' + (base ? base + '/' : '') + module.get(base).get(lower)
}

function importModule(pkgStore, name, path) {
  return addDefault(path, resolvePath(pkgStore, name, path), { nameHint: name })
}

export default _.memoize(importModule, (pkgStore, name) => (pkgStore.path + '/' + name).toLowerCase())
