import _ from 'lodash';
import MapCache from './MapCache';

const reLodash = /^lodash(?:-compat|-es)?$/;

/*----------------------------------------------------------------------------*/

export default class PackageStore extends MapCache {
  constructor(pkgPath) {
    super();

    pkgPath = _.toString(pkgPath);
    const parts = pkgPath.split('/');

    this.base = parts.slice(1).join('/');
    this.id = parts[0];
    this.isLodash = _.constant(reLodash.test(this.id));
    this.path = pkgPath;
  }
};
