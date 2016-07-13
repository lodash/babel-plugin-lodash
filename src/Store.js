import _ from 'lodash';
import MapCache from './MapCache';
import PackageStore from './PackageStore';

function normalize(pkgPath) {
  return _.toString(pkgPath).replace(/\\/g, '/');
}

/*----------------------------------------------------------------------------*/

export default class Store extends MapCache {
  constructor(pkgPaths) {
    super();
    _.each(pkgPaths, pkgPath => this.set(pkgPath));
  }

  clear() {
    this.__data__.forEach(map => map.clear());
    return this;
  }

  get(pkgPath) {
    return super.get(normalize(pkgPath));
  }

  set(pkgPath, pkgStore=new PackageStore(normalize(pkgPath))) {
    return super.set(normalize(pkgPath), pkgStore);
  }
};
