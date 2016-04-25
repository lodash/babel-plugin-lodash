'use strict';

import _ from 'lodash';

/*----------------------------------------------------------------------------*/

export default class PackageStore {
  constructor(id) {
    this.id = id;
    this.__data__ = {
      'default': new Set,
      'module': new Map
    };
  }

  clear() {
    _.invokeMap(this.__data__, 'clear');
  }

  get(type) {
    return this.__data__[type];
  }

  set(type, map) {
    this.__data__[type] = map;
    return this;
  }

  get [Symbol.iterator]() {
    this.__data__[Symbol.iterator]();
  }
};
