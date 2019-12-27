import helpers from '../../../src/utils/array-helpers'

describe('Utils / Array Helpers', () => {

  test('It creates a serialized array from a given length', () => {
    const control = [0, 1, 2]

    const result = helpers.makeArray(3)
    expect(result).toEqual(control)
  })

})
