import _ from 'lodash';
import MapCache from './MapCache';

const reLodash = /^lodash(?:-compat|-es)?$/;

/*----------------------------------------------------------------------------*/

export default class PackageStore extends MapCache {
  constructor(pkgPath) {
    super([
      ['default', new MapCache],
      ['identifier', new MapCache],
      ['member', new MapCache]
    ]);

    pkgPath = _.toString(pkgPath);
    const parts = pkgPath.split('/');

    this.base = parts.slice(1).join('/');
    this.id = parts[0];
    this.path = pkgPath;
  }

  clear() {
    _.invokeMap(_.toArray(this.__data__), '[1].clear');
    return this;
  }

  isLodash() {
    return reLodash.test(this.id);
  }
};
