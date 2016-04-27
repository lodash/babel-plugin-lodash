'use strict';

import _ from 'lodash';
import MapCache from './MapCache';

/*----------------------------------------------------------------------------*/

export default class PackageStore extends MapCache {
  constructor(id) {
    super([['default', new MapCache], ['member', new MapCache]]);
    this.id = id;
  }

  clear() {
    _.invokeMap(_.toArray(this.__data__), 'clear');
    return this;
  }
};
