import _ from 'lodash'

/*----------------------------------------------------------------------------*/

/**
 * Normalizes `pkgPath` by converting path separators to forward slashes.
 *
 * @static
 * @memberOf util
 * @param {string} [pkgPath=''] The package path to normalize.
 * @returns {string} Returns the normalized package path.
 */
export function normalizePath(pkgPath) {
  return _.toString(pkgPath).replace(/\\/g, '/')
}
