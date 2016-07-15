import _ from 'lodash';

const reLodash = /^lodash(?:-compat|-es)?$/;

/*----------------------------------------------------------------------------*/

export default class Package {
  constructor(pkgPath) {
    pkgPath = _.toString(pkgPath);
    const parts = pkgPath.split('/');

    this.base = parts.slice(1).join('/');
    this.id = parts[0];
    this.isLodash = _.constant(reLodash.test(this.id));
    this.path = pkgPath;
  }
};
