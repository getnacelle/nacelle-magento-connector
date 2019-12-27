import Magento from '../../../src/services/magento'

describe('Services / Magento Service', () => {

  const host = 'http://magentodemo.getnacelle.com'
  const token = 'fjiejtudjf049459ifsk9fgdi9efko'

  const magento = new Magento(host, token, false)

  test('It creates an http protocol store', () => {
    expect(magento.secure).toBe(false)
  })

  test('It sets the store protocol to https', () => {
    magento.secure = true
    expect(magento.secure).toBe(true)
  })

})