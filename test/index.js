import path from "path";
import fs from "fs";
import assert from "assert";
import {transformFileSync} from "babel";
import plugin from "../src/index";
import {trim} from "lodash";

describe("Lodash modularized builds without the hassle", () => {
  const fixturesDir = path.join(__dirname, "fixtures");

  fs.readdirSync(fixturesDir).map(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, "actual.js");
    const expectedFile = path.join(fixtureDir, "expected.js");

    it(`should ${caseName.split("-").join(" ")}`, () => {
      const actual = transformFileSync(actualFile, {
        plugins: [plugin]
      }).code;
      const expected = fs.readFileSync(expectedFile).toString();
      assert.equal(trim(actual), trim(expected));
    });
  });
});
