import _ from 'lodash';
import MapCache from './MapCache';
import Package from './Package';

function normalize(pkgPath) {
  return _.toString(pkgPath).replace(/\\/g, '/');
}

/*----------------------------------------------------------------------------*/

export default class Store extends MapCache {
  constructor(pkgPaths) {
    super();
    _.each(pkgPaths, pkgPath => this.set(pkgPath));
  }

  get(pkgPath) {
    return super.get(normalize(pkgPath));
  }

  set(pkgPath, pkgStore=new Package(normalize(pkgPath))) {
    return super.set(normalize(pkgPath), pkgStore);
  }
};
