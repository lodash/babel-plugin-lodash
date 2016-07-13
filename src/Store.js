import _ from 'lodash';
import MapCache from './MapCache';
import PackageStore from './PackageStore';

function clear(store) {
  _.invokeMap(store, 'cache.clear');
}

function clearDeep(store) {
  clear(store);
  _.invokeMap(_.toArray(store.__data__), '[1].clear');
}

function getByResolver(type, key) {
  return type + '/' + key;
}

function normalize(pkgPath) {
  return _.toString(pkgPath).replace(/\\/g, '/');
}

/*----------------------------------------------------------------------------*/

export default class Store extends MapCache {
  constructor(pkgPaths) {
    super();
    _.each(pkgPaths, pkgPath => this.set(pkgPath));

    this.getStoreBy = _.memoize(this.getStoreBy, getByResolver);
    this.getMapBy = _.memoize(this.getMapBy, getByResolver);
    this.getValueBy = _.memoize(this.getValueBy, getByResolver);
  }

  clear() {
    clearDeep(this);
    return this;
  }

  delete(key) {
    clear(this);
    return super.delete(key);
  }

  get(pkgPath) {
    return super.get(normalize(pkgPath));
  }

  getStoreBy(type, key) {
    return super.find(entry => _.invoke(entry.get(type), 'has', key));
  }

  getMapBy(type, key) {
    return _.invoke(this.getStoreBy(type, key), 'get', type);
  }

  getValueBy(type, key) {
    return _.invoke(this.getMapBy(type, key), 'get', key);
  }

  set(pkgPath, pkgStore=new PackageStore(normalize(pkgPath))) {
    return super.set(normalize(pkgPath), pkgStore);
  }
};
