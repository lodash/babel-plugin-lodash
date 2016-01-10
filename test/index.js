import assert from 'assert';
import { transformFileSync } from 'babel-core';
import fs from 'fs';
import path from 'path';
import plugin from '../src/index';

describe('Lodash modularized builds', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  const errorFixturesDir = path.join(__dirname, 'error-fixtures');

  fs.readdirSync(fixturesDir).map(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');
    const expectedFile = path.join(fixtureDir, 'expected.js');

    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const actual = transformFileSync(actualFile, {
        'plugins': [plugin]
      }).code;
      const expected = fs.readFileSync(expectedFile, 'utf8');
      assert.equal(actual.trim(), expected.trim());
    });
  });

  fs.readdirSync(errorFixturesDir).map(caseName => {
    const fixtureDir = path.join(errorFixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');

    it(`should throw an error with ${caseName.split('-').join(' ')}`, () => {
      assert.throws(function() {
        const actual = transformFileSync(actualFile, {
          'plugins': [plugin]
        }).code;
      });
    });
  });
});
