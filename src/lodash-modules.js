import path from 'path';
import {findKey, transform} from 'lodash';
import fs from 'fs';

// Slow synchronous version of https://github.com/megawac/lodash-modularize/blob/master/src/lodashModules.js
// Using the paths lodash-cli provides is not an option as they may change version to version =(

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter(filePath =>
    fs.statSync(path.join(srcPath, filePath)).isDirectory());
}

const expectedPath = './node_modules/lodash';
const modularizePath = path.join(__dirname, '../node_modules/lodash');

let lodashPath = fs.existsSync(expectedPath) ? expectedPath : modularizePath;

let categoryMap = transform(getDirectories(lodashPath), (result, category) => {
  result[category] = fs.readdirSync(path.join(lodashPath, category)).map(name => path.basename(name, '.js'));
}, {});

export default function resolveModule(name) {
  let category = findKey(categoryMap, funcs => funcs.indexOf(name) > -1);
  if (category) {
    return path.join('lodash', category, name);
  }
  throw new Error(`lodash method ${name} was not in known modules
    Please file a bug if it's my fault https://github.com/megawac/babel-plugin-lodash/issues
  `);
};
