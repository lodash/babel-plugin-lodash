'use strict';

import _ from 'lodash';
import PackageStore from './PackageStore';

function getByResolver(type, key) {
  return type + '/' +key;
}

/*----------------------------------------------------------------------------*/

export default class Store {
  constructor(ids) {
    const map = this.__data__ = new Map;
    _.reduce(ids, (map, id) => map.set(id, new PackageStore(id)), map);

    this.getMapBy = _.memoize(this.getMapBy, getByResolver);
    this.getStoreBy = _.memoize(this.getStoreBy, getByResolver);
    this.getValueBy = _.memoize(this.getValueBy, getByResolver);
  }

  clear() {
    _.invokeMap(this, 'cache.clear');
    _.invokeMap(_.toArray(this.__data__), '[1].clear');
    return this;
  }

  get(id) {
    return this.__data__.get(id);
  }

  getMapBy(type, key) {
    const store = this.getStoreBy(type, key);
    if (store) {
      return store.get(type);
    }
  }

  getStoreBy(type, key) {
    return _.nth(_.find(_.toArray(this.__data__), entry => {
      const map = entry[1].get(type);
      if (map) {
        return map.has(key);
      }
    }), 1);
  }

  getValueBy(type, key) {
    const map = this.getMapBy(type, key);
    if (map) {
      return map.get(key);
    }
  }

  set(id, packageStore) {
    _.invokeMap(this, 'cache.clear');
    this.__data__.set(id, packageStore);
    return this;
  }

  get [Symbol.iterator]() {
    return this.__data__[Symbol.iterator]();
  }
};
