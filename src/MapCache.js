import _ from 'lodash';

const BREAK = {};
const DATA = Symbol('data');

/*----------------------------------------------------------------------------*/

export default class MapCache {
  constructor(entries) {
    this[DATA] = new Map(entries);
    _.bindAll(this[DATA], ['entries', 'forEach', 'keys', 'values']);
  }

  clear() {
    this[DATA].clear();
    return this;
  }

  delete(key) {
    return this[DATA].delete(key);
  }

  findKey(iteratee) {
    let result;
    try {
      this[DATA].forEach((value, key, map) => {
        if (iteratee(value, key, map)) {
          result = key;
          throw BREAK;
        }
      });
    } catch (e) {
      if (e !== BREAK) {
        throw e;
      }
    }
    return result;
  }

  get(key) {
    return this[DATA].get(key);
  }

  has(key) {
    return this[DATA].has(key);
  }

  set(key, value) {
    this[DATA].set(key, value);
    return this;
  }

  get entries() {
    return this[DATA].entries;
  }

  get forEach() {
    return this[DATA].forEach;
  }

  get keys() {
    return this[DATA].keys;
  }

  get size() {
    return this[DATA].size;
  }

  get values() {
    return this[DATA].values;
  }

  get [Symbol.iterator]() {
    return this[DATA].entries;
  }
};
