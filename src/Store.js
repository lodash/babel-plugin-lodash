import _ from 'lodash'
import MapCache from './MapCache'
import { normalizePath } from './util'
import Package from './Package'

/*----------------------------------------------------------------------------*/

export default class Store extends MapCache {
  constructor(pkgPaths) {
    super()
    _.each(pkgPaths, (pkgPath) => this.set(pkgPath))
  }

  get(pkgPath) {
    return super.get(normalizePath(pkgPath))
  }

  set(pkgPath, pkgStore = new Package(normalizePath(pkgPath))) {
    return super.set(normalizePath(pkgPath), pkgStore)
  }
}
