'use strict';

import _ from 'lodash';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import plugin from '../src/index';
import { transformFileSync } from 'babel-core';

describe('Lodash modularized builds', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');

  _.each(fs.readdirSync(fixturesPath), testName => {
    const fixturePath = path.join(fixturesPath, testName);
    const actualPath = path.join(fixturePath, 'actual.js');
    const expectedPath = path.join(fixturePath, 'expected.js');

    it(`should work with ${ _.lowerCase(testName) }`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8');

      const actual = transformFileSync(actualPath, {
        'plugins': [plugin]
      }).code;

      assert.equal(_.trim(actual), _.trim(expected));
    });
  });

  /*--------------------------------------------------------------------------*/

  const errorFixturesPath = path.join(__dirname, 'error-fixtures');

  _.each(fs.readdirSync(errorFixturesPath), testName => {
    const fixturePath = path.join(errorFixturesPath, testName);
    const actualPath = path.join(fixturePath, 'actual.js');

    it(`should throw an error with ${ _.lowerCase(testName) }`, () => {
      assert.throws(function() {
        transformFileSync(actualPath, {
          'plugins': [plugin]
        }).code;
      });
    });
  });

  /*--------------------------------------------------------------------------*/

  const parsingFixturesPath = path.join(__dirname, 'parsing-fixtures');

  _.each(fs.readdirSync(parsingFixturesPath), testName => {
    const fixturePath = path.join(parsingFixturesPath, testName);
    const actualPath = path.join(fixturePath, 'actual.js');

    it(`should not error with ${ _.lowerCase(testName) }`, () => {
      transformFileSync(actualPath, {
        'plugins': [plugin]
      }).code;
    });
  });
});
