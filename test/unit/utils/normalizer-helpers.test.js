import helpers from '../../../src/utils/normalizer-helpers'

describe('Utils / Normalizer Helpers', () => {

  describe('It gets the attribute value for a given key', () => {
    const testStr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    const testContext = [{
      attribute_code: 'description',
      value: testStr
    }]

    test('It found and element with matching attribute_code', () => {
      const result = helpers.getAttribute(testContext, 'description')
      expect(result).toEqual(testStr)
    })

    test('It did not find the element matching a given attribute_code', () => {
      const control = ''

      const result = helpers.getAttribute(testContext, 'image')
      expect(result).toEqual(control)
    })

  })


})
