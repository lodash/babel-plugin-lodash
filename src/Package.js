import _ from 'lodash'
import requirePackageName from 'require-package-name'

const reLodash = /^lodash(?:-compat|-es)?$/

/*----------------------------------------------------------------------------*/

export default class Package {
  constructor(pkgPath) {
    pkgPath = _.toString(pkgPath)
    const pkgName = requirePackageName(pkgPath)

    this.base = pkgPath.replace(new RegExp(pkgName + '/?'), '')
    this.id = pkgName
    this.isLodash = _.constant(reLodash.test(this.id))
    this.path = pkgPath
  }
}
