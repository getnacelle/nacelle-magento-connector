import Machine from 'machine'
import Magento from '../../services/magento'
import appConfig, { connector } from '../../../config/app'

const helper = {

  friendlyName: 'Update Cart Items',

  description: 'Update Items in Magento Cart',

  inputs: {
    host: {
      type: 'string',
      description: 'Magento host url',
      required: true
    },
    token: {
      type: 'string',
      description: 'Magento access token',
      required: true
    },
    cartId: {
      type: 'string',
      description: 'Cart Quote ID',
      required: true
    },
    items: {
      type: 'ref',
      description: 'Array of items to update',
      required: true
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ host, token, cartId, items }, exits) {
    const magento = new Magento(host, token)

    try {

      const cart = await magento.getCart(cartId)

      const promises = items.map(item => {
        const inCartItem = cart.items.find(x => x.sku === item.sku)
        if (inCartItem) {
          const update = {
            cart_item: {
              item_id: inCartItem.item_id,
              qty: item.qty,
              quote_id: cartId
            }
          }
          return magento.cartUpdateItem(cartId, inCartItem.item_id, update)
          // return update
        }
        item.quote_id = cartId
        // return item
        return magento.cartAddItem(cartId, { cart_item: item })
      })

      const results = await Promise.all(promises)
      const updatedCart = await magento.getCart(cartId)

      return await exits.success(updatedCart.items)
    } catch (e) {
      console.log(e)
      return exits.error(new Error(e))
    }
  }
}

export default Machine(helper)
