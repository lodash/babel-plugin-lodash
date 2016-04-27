'use strict';

import _ from 'lodash';

function findEntry(map, iteratee) {
  return _.find(_.toArray(map), entry => iteratee(entry[1], entry[0], map));
}

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

  find(iteratee) {
    return _.nth(findEntry(this.__data__, iteratee), 1);
  }

  findKey(iteratee) {
    return _.first(findEntry(this.__data__, iteratee));
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
