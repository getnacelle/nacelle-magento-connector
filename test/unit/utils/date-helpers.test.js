import helpers from '../../../src/utils/date-helpers'

describe('Utils / Date Helpers', () => {

  test('It converts the date string into seconds', () => {
    const control = 946713600
    const testDate = 'jan 1, 2000'

    const result = helpers.getSeconds(testDate)
    expect(result).toEqual(control)
  })

})
