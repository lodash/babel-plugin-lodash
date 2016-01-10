import Module from 'module';
import path from 'path';
import { assign, findKey, transform } from 'lodash';
import fs from 'fs';

function getDirectories(srcPath) {
  // Slow synchronous version of https://github.com/megawac/lodash-modularize/blob/master/src/lodashModules.js.
  // Using the paths lodash-cli provides is not an option as they may change version to version =(
  return fs.readdirSync(srcPath).filter(filePath =>
    fs.statSync(path.join(srcPath, filePath)).isDirectory());
}

const lodashPath = path.dirname(Module._resolveFilename('lodash', assign(new Module, {
  'paths': Module._nodeModulePaths(process.cwd())
})));

const categoryMap = transform(getDirectories(lodashPath), (result, category) => {
  result[category] = fs.readdirSync(path.join(lodashPath, category)).map(name => path.basename(name, '.js'));
}, {});

export default function resolveModule(name) {
  let category = findKey(categoryMap, funcs => funcs.indexOf(name) > -1);
  if (category) {
    return path.join('lodash', category, name);
  }
  throw new Error([
    `lodash method ${name} was not in known modules.`,
    'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
  ].join('\n'));
};
