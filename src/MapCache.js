'use strict';

import _ from 'lodash';

/*----------------------------------------------------------------------------*/

export default class MapCache {
  constructor(values) {
    this.__data__ = new Map(values);
  }

  clear() {
    this.__data__.clear();
    return this;
  }

  delete(key) {
    return this.__data__.delete(key);
  }

  findKey(iteratee) {
    return _.first(_.find(_.toArray(this.__data__), entry => {
      return iteratee(entry[1], entry[0], this.__data__);
    }));
  }

  get(key) {
    return this.__data__.get(key);
  }

  has(key) {
    return this.__data__.has(key);
  }

  set(key, value) {
    this.__data__.set(key, value);
    return this;
  }

  get [Symbol.iterator]() {
    return this.__data__[Symbol.iterator]();
  }
};
