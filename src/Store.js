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

/*----------------------------------------------------------------------------*/

export default class Store extends MapCache {
  constructor(ids) {
    super();
    _.each(ids, id => this.set(id));

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

  getStoreBy(type, key) {
    return super.find(entry => _.invoke(entry.get(type), 'has', key));
  }

  getMapBy(type, key) {
    return _.invoke(this.getStoreBy(type, key), 'get', type);
  }

  getValueBy(type, key) {
    return _.invoke(this.getMapBy(type, key), 'get', key);
  }

  set(id, pkgStore=new PackageStore(id)) {
    clear(this);
    return super.set(id, pkgStore);
  }
};
