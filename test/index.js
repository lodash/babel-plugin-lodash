import _ from 'lodash';
import assert from 'assert';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import plugin from '../src/index';
import { transformFileSync } from 'babel-core';

function getLodashId(testPath) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath);
  return 'lodash' + (postfix ? '-' + postfix : '');
}

/*----------------------------------------------------------------------------*/

describe('cherry-picked modular builds', () => {
  _.each(glob.sync(path.join(__dirname, 'fixtures/*/')), testPath => {
    const testName = _.lowerCase(path.basename(testPath));
    const lodashId = getLodashId(testName);
    const actualPath = path.join(testPath, 'actual.js');
    const expectedPath = path.join(testPath, 'expected.js');

    it(`should work with ${ testName }`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8');
      const actual = transformFileSync(actualPath, {
        'plugins': [[plugin, { 'id': lodashId }]]
      }).code;

      assert.strictEqual(_.trim(actual), _.trim(expected));
    });
  });

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'error-fixtures/*/')), testPath => {
    const testName = _.lowerCase(path.basename(testPath));
    const lodashId = getLodashId(testName);
    const actualPath = path.join(testPath, 'actual.js');

    it(`should throw an error with ${ testName }`, () => {
      assert.throws(function() {
        transformFileSync(actualPath, {
          'plugins': [[plugin, { 'id': lodashId }]]
        }).code;
      });
    });
  });

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'parsing-fixtures/*/')), testPath => {
    const testName = _.lowerCase(path.basename(testPath));
    const lodashId = getLodashId(testName);
    const actualPath = path.join(testPath, 'actual.js');

    it(`should not error with ${ testName }`, () => {
      transformFileSync(actualPath, {
        'plugins': [[plugin, { 'id': lodashId }]]
      }).code;
    });
  });

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'acceptance-fixtures/*/')), testPath => {
    const testName = _.lowerCase(path.basename(testPath));
    const lodashId = getLodashId(testName);
    const actualPath = path.join(testPath, 'actual.js');
    const expectedPath = path.join(testPath, 'expected.js');
    const babelOptions = require(path.join(testPath, 'babelrc.json'));
    babelOptions.plugins.push([plugin, { 'id': lodashId }]);

    it(`should work with ${ testName }`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8');
      const actual = transformFileSync(actualPath, babelOptions).code;

      assert.strictEqual(_.trim(actual), _.trim(expected));
    });
  });
});
