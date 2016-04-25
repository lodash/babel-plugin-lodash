'use strict';

import _ from 'lodash';
import fs from 'fs';
import Module from 'module';
import path from 'path';

function getDirectories(srcPath) {
  return ['.'].concat(fs.readdirSync(srcPath)).filter(filePath =>
    fs.statSync(path.join(srcPath, filePath)).isDirectory());
}

const lodashPath = path.dirname(Module._resolveFilename('lodash', _.assign(new Module, {
  'paths': Module._nodeModulePaths(process.cwd())
})));

const categoryMap = _.transform(getDirectories(lodashPath), (result, category) => {
  result[category] = fs.readdirSync(path.join(lodashPath, category))
    .filter(name => path.extname(name) == '.js')
    .map(name => path.basename(name, '.js'));
}, {});

export default function resolveModule(name, base) {
  const category = base
    ? (_.includes(categoryMap[base], name) && base)
    : _.findKey(categoryMap, funcs => _.includes(funcs, name));

  if (!category) {
    throw new Error([
      `Lodash method ${name} is not a known module.`,
      'Please report bugs to https://github.com/lodash/babel-plugin-lodash/issues.'
    ].join('\n'));
  }
  return path.join('lodash', category, name);
}
