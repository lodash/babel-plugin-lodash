import _ from 'lodash'
import { assert } from 'chai'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import plugin from '../src/index'
import { transformFileSync } from 'babel-core'

function getLodashId(testPath) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath)
  return 'lodash' + (postfix ? '-' + postfix : '')
}

function getTestName(testPath) {
  return path.basename(testPath).split('-').join(' ')
}

/*----------------------------------------------------------------------------*/

describe('cherry-picked modular builds', function() {
  this.timeout(0)

  _.each(glob.sync(path.join(__dirname, 'fixtures/*/')), (testPath) => {
    const testName = getTestName(testPath)
    const lodashId = getLodashId(testName)
    const actualPath = path.join(testPath, 'actual.js')
    const expectedPath = path.join(testPath, 'expected.js')

    it(`should work with ${ testName }`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8')
      const actual = transformFileSync(actualPath, {
        'plugins': [[plugin, { 'id': [lodashId, '@storybook/addon-links'] }]]
      }).code

      assert.strictEqual(_.trim(actual), _.trim(expected))
    })
  })

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'error-fixtures/*/')), (testPath) => {
    const testName = getTestName(testPath)
    const actualPath = path.join(testPath, 'actual.js')

    it(`should throw an error with ${ testName }`, () => {
      const error = _.attempt(() => transformFileSync(actualPath, {
        'plugins': [plugin]
      }))

      assert.ok(_.isError(error))
      assert.ok(_.isString(_.get(error, 'codeFrame')))
    })
  })

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'mixed-fixtures/*/')), (testPath) => {
    const testName = getTestName(testPath)
    const actualPath = path.join(testPath, 'actual.js')
    const expectedPath = path.join(testPath, 'expected.js')
    const optionsPath = path.join(testPath, 'options.json')
    const options = fs.existsSync(optionsPath) ? require(optionsPath) : {}

    it(`should work with ${ testName }`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8')
      const actual = transformFileSync(actualPath, {
        'plugins': [[plugin, options]]
      }).code

      assert.strictEqual(_.trim(actual), _.trim(expected))
    })
  })

  /*--------------------------------------------------------------------------*/

  _.each(glob.sync(path.join(__dirname, 'parsing-fixtures/*/')), (testPath) => {
    const testName = getTestName(testPath)
    const actualPath = path.join(testPath, 'actual.js')

    it(`should not error with ${ testName }`, () => {
      transformFileSync(actualPath, {
        'plugins': [plugin]
      })
    })
  })
})
