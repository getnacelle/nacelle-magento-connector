import helpers from '../../../src/utils/string-helpers'

describe('Utils / String Helpers', () => {
  test('It converted the string to camel case', () => {
    const controlStr = 'camelCase'
    const testStr = 'camel-case'

    const result = helpers.camelCase(testStr)
    expect(result).toEqual(controlStr)
  })

  test('It removed the trailing char from string', () => {
    const controlStr = 'remove-trailing'
    const testStr = controlStr + '-'

    const result = helpers.removeTrailing(testStr, '-')
    expect(result).toEqual(controlStr)
  })

  test('It created a dash separated lower case string', () => {
    const controlStr = 'uss-enterprise-ncc-1701'
    const testStr = 'USS Enterprise NCC 1701'

    const result = helpers.slugify(testStr)
    expect(result).toEqual(controlStr)
  })
})
