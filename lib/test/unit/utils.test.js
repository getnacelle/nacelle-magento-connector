import utils from '../../utils'

describe('Utils / Internal', () => {

  test('It sets the X-Powered-By header in response', () => {
    const control = 'USS Enterprise NCC-1701'
    const testReq = {}
    const testRes = new Map()
    const noop = () => {

    }

    utils.poweredBy(testReq, testRes, noop)

    expect(testRes.get('X-Powered-By')).toEqual(control)

  })

  test('It capitalizes the first letter in a word', () => {
    const control = 'Enterprise'
    const testStr = control.toLowerCase()

    const result = utils.capitalize(testStr)

    expect(result).toEqual(control)
  })

})
