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
    _.invokeMap(_.toArray(this.__data__), '[1].clear');
    return this;
  }

  set(pkgPath, pkgStore=new PackageStore(pkgPath)) {
    return super.set(normalize(pkgPath), pkgStore);
  }
};
