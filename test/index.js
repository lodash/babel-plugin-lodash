'use strict';

import assert from 'assert';
import { transformFileSync } from 'babel-core';
import fs from 'fs';
import path from 'path';
import plugin from '../src/index';

describe('Lodash modularized builds', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  const errorFixturesDir = path.join(__dirname, 'error-fixtures');
  const parsingFixturesDir = path.join(__dirname, 'parsing-fixtures');

  fs.readdirSync(fixturesDir).map(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');
    const expectedFile = path.join(fixtureDir, 'expected.js');

    it(`should work with ${ caseName.split('-').join(' ') }`, () => {
      const expected = fs.readFileSync(expectedFile, 'utf8');

      const actual = transformFileSync(actualFile, {
        'plugins': [plugin]
      }).code;

      assert.equal(actual.trim(), expected.trim());
    });
  });

  fs.readdirSync(errorFixturesDir).map(caseName => {
    const fixtureDir = path.join(errorFixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');

    it(`should throw an error with ${ caseName.split('-').join(' ') }`, () => {
      assert.throws(function() {
        transformFileSync(actualFile, {
          'plugins': [plugin]
        }).code;
      });
    });
  });

  fs.readdirSync(parsingFixturesDir).map(caseName => {
    const fixtureDir = path.join(parsingFixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');

    it(`should not error with ${ caseName.split('-').join(' ') }`, () => {
      transformFileSync(actualFile, {
        'plugins': [plugin]
      }).code;
    });
  });
});
