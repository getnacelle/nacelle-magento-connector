import helpers from '../../../src/utils/object-helpers'

describe('Utils / Object Helpers', () => {

  test('It strips all properties [string|array|object] with empty values', () => {
    const control = {
      string: 'Hello',
      boolean: true,
      object: { hasValue: 'yes' },
      array: [0, 1, 2, 3]
    }

    const testObj = {
      emptyString: '',
      emptyArray: [],
      emptyObject: {},
      ...control
    }

    const result = helpers.stripNullEmpty(testObj)
    expect(result).toEqual(control)
  })

})
