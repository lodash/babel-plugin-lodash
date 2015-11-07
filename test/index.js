import path from "path";
import fs from "fs";
import assert from "assert";
import {transformFileSync} from "babel-core";
import plugin from "../src/index";
import {trim} from "lodash";

describe("Lodash modularized builds", () => {
  const fixturesDir = path.join(__dirname, "fixtures");
  const errorFixturesDir = path.join(__dirname, "error-fixtures");

  fs.readdirSync(fixturesDir).map(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, "actual.js");
    const expectedFile = path.join(fixtureDir, "expected.js");

    it(`should work with ${caseName.split("-").join(" ")}`, () => {
      const actual = transformFileSync(actualFile, {
        plugins: [plugin]
      }).code;
      const expected = fs.readFileSync(expectedFile).toString();
      assert.equal(trim(actual), trim(expected));
    });
  });

  fs.readdirSync(errorFixturesDir).map(caseName => {
    const fixtureDir = path.join(errorFixturesDir, caseName);
    const actualFile = path.join(fixtureDir, "actual.js");

    it(`should throw an error with ${caseName.split("-").join(" ")}`, () => {
      assert.throws(function() {
        const actual = transformFileSync(actualFile, {
          plugins: [plugin]
        }).code;
      });
    });
  });
});
