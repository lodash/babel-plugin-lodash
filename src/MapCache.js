import _ from 'lodash'
import Map from './Map'

const BREAK = {}

/*----------------------------------------------------------------------------*/

export default class MapCache extends Map {
  clear() {
    super.clear()
    return this
  }

  findKey(iteratee) {
    let result

    try {
      this.forEach((value, key, map) => {
        if (iteratee(value, key, map)) {
          result = key
          throw BREAK
        }
      })
    } catch (e) {
      if (e !== BREAK) {
        throw e
      }
    }

    return result
  }
}
