import Magento, { fixtures } from '../../../src/services/magento'

jest.mock('../../../src/services/magento')


describe('Services / Magento Service', () => {

  const host = 'http://magentodemo.getnacelle.com'
  const token = 'fjiejtudjf049459ifsk9fgdi9efko'

  const magento = new Magento(host, token, false)

  test('It sets the store protocol to https', () => {
    magento.secure = true
    expect(magento.secure).toBe(true)
  })

  describe('Configuration', () => {

    test('It can get the store config', async () => {
      const results = await magento.getStoreConfig() 
      expect(results).toEqual(fixtures.storeConfig)
    })

    test('It throw an error', async() => {
      // expect(() => {
      //   magento.getStoreConfig(false)
      // }).toThrow()
      
    })

  })

  describe('Cart', () => {

    test('It creates a Guest Cart', async () => {
      const results = await magento.createCart()
      expect(results).toEqual(fixtures.cartId)
    })

    test('It can Get Guest Cart by Cart ID', async () => {
      const results = await magento.getCart(fixtures.cartId)
      expect(results).toEqual(fixtures.cart)
    })

    // test('It failed to Get Guest Cart because Cart ID does not exist', async () => {
    //   return false
    // })

    test('It can Add an Item to Cart', async () => {
      const results = await magento.cartAddItem(fixtures.cartId, fixtures.itemsInsert)
      expect(results).toEqual(fixtures.itemAdded)
    })

    // test('It fails to Add an Item to Cart because Cart ID is missing', async () => {      
      
    // })

    test('It can Update an Items quantity in Cart', async () => {
      const results = await magento.cartAddItem(fixtures.cartId, fixtures.itemAdded[0].item_id, fixtures.itemsInsert)
      expect(results).toEqual(fixtures.itemAdded)
    })

    test('It can remove an Item from Cart', async () => {
      const results = await magento.cartRemoveItem(fixtures.cartId, fixtures.itemAdded[0].item_id)
      expect(results).toEqual(fixtures.itemAdded)
    })

    test('It can get Payment methods available to Cart', async () => {
      const results = await magento.getPaymentMethods(fixtures.cartId)
      expect(results).toEqual(fixtures.paymentMethods)
    })

    test('It can get available Shipping Methods for Cart', async () => {
      const results = await magento.getShippingMethodsByAddress(fixtures.cartId, fixtures.address)
      expect(results).toEqual(fixtures.shippingMethods)
    })

    test('It can get a Guest Cart total', async () => {
      const results = await magento.setCartInfo(fixtures.cartId, fixtures.totalRequest)
      expect(results).toEqual(fixtures.cartTotal)
    })

    // test('It can set the Shipping Address, Billing Address, and Shipping Methods for Cart', async () => {

    // })

    // test('It can get countries as a list', async () => {

    // })

    // test('It can get country data by country code', async () => {

    // })

  })

  describe('Checkout', () => {

    test('It can complete a Checkout with Payment Information', async () => {
      const results = await magento.createOrder(fixtures.cartId, fixtures.checkout)
      expect(results).toEqual(1)
    })

  })

  describe('Orders', () => {

    test('It can get an Order by Order ID', async () => {
      const results = await magento.getOrder(1)
      expect(results).toEqual(fixtures.order)
    })

  })

})
