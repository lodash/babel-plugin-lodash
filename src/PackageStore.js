'use strict';

import _ from 'lodash';

/*----------------------------------------------------------------------------*/

export default class PackageStore {
  constructor(id) {
    this.id = id;
    this.__data__ = {
      'default': new Map,
      'member': new Map
    };
  }

  clear() {
    _.invokeMap(this.__data__, 'clear');
    return this;
  }

  delete(type) {
    return delete this.__data__[type];
  }

  get(type) {
    return this.__data__[type];
  }

  has(id) {
    return _.has(this.__data__, id);
  }

  set(type, map) {
    this.__data__[type] = map;
    return this;
  }

  get [Symbol.iterator]() {
    return this.__data__[Symbol.iterator]();
  }
};
