'use strict';

import _ from 'lodash';
import PackageStore from './PackageStore';

function clear(store) {
  _.invokeMap(store, 'cache.clear');
  toArray.cache.clear();
}

function clearDeep(store) {
  _.invokeMap(toArray(store.__data__), '[1].clear');
  clear(store);
}

function getByResolver(type, key) {
  return type + '/' + key;
}

var toArray = _.memoize(_.toArray);

/*----------------------------------------------------------------------------*/

export default class Store {
  constructor(ids) {
    const map = this.__data__ = new Map;
    _.reduce(ids, (map, id) => map.set(id, new PackageStore(id)), map);

    this.getStoreBy = _.memoize(this.getStoreBy, getByResolver);
    this.getMapBy = _.memoize(this.getMapBy, getByResolver);
    this.getValueBy = _.memoize(this.getValueBy, getByResolver);
  }

  clear() {
    clearDeep(this);
    return this;
  }

  get(id) {
    return this.__data__.get(id);
  }

  getStoreBy(type, key) {
    return _.nth(_.find(toArray(this.__data__), entry => {
      const map = entry[1].get(type);
      if (map) {
        return map.has(key);
      }
    }), 1);
  }

  getMapBy(type, key) {
    const store = this.getStoreBy(type, key);
    if (store) {
      return store.get(type);
    }
  }

  getValueBy(type, key) {
    const map = this.getMapBy(type, key);
    if (map) {
      return map.get(key);
    }
  }

  set(id, packageStore) {
    clear(this);
    this.__data__.set(id, packageStore);
    return this;
  }

  get [Symbol.iterator]() {
    return this.__data__[Symbol.iterator]();
  }
};
