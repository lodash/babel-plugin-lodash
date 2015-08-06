import path from 'path';
import {includes, result, zipObject} from 'lodash';
import fs from 'fs';
import {aliasToReal} from 'lodash-cli/lib/mapping';

// Slow synchronous version of https://github.com/megawac/lodash-modularize/blob/master/src/lodashModules.js
// Using the paths lodash-cli provides is not an option as they may change version to version =(

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file =>
        fs.statSync(path.join(srcpath, file)).isDirectory());
}

const expectedPath = './node_modules/lodash';
const modularizePath = path.join(__dirname, '../node_modules/lodash');

let lodashPath = fs.existsSync(expectedPath) ? expectedPath : modularizePath;
let m = getDirectories(lodashPath)

let funcs = m.map(val => {
  return fs.readdirSync(path.join(lodashPath, val)).map(name => name.slice(0, -3));
});

export let modules = zipObject(m, funcs)

export default function resolveModule(name) {
  let realName = result(aliasToReal, name, name);

  for (var category in modules) {
    if (includes(modules[category], realName)) {
      return path.join('lodash', category, realName);
    }
  }
  throw new Error(`lodash method ${name} was not in known modules
    Please file a bug if it's my fault https://github.com/megawac/babel-plugin-lodash/issues
  `);
};
