import _ from 'lodash';
import MapCache from './MapCache';

/*----------------------------------------------------------------------------*/

export default class PackageStore extends MapCache {
  constructor(pkgPath) {
    super([
      ['default', new MapCache],
      ['identifier', new MapCache],
      ['member', new MapCache]
    ]);
    const parts = pkgPath.split('/');
    this.base = parts[1] || '';
    this.id = parts[0];
    this.path = pkgPath;
  }

  clear() {
    _.invokeMap(_.toArray(this.__data__), '[1].clear');
    return this;
  }
};
