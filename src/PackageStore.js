import _ from 'lodash';
import MapCache from './MapCache';

/*----------------------------------------------------------------------------*/

export default class PackageStore extends MapCache {
  constructor(id) {
    super([
      ['default', new MapCache],
      ['identifier', new MapCache],
      ['member', new MapCache]
    ]);
    this.id = id;
  }

  clear() {
    _.invokeMap(_.toArray(this.__data__), '[1].clear');
    return this;
  }
};
