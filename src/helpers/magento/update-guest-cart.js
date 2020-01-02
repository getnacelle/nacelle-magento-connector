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
    quoteId: {
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

  async fn({ host, token, quoteId, items }, exits) {
    const magento = new Magento(host, token)

    try {

      const cart = await magento.getGuestCart(quoteId)

      const promises = items.map(item => {
        const inCartItem = cart.items.find(x => x.sku === item.sku)
        if (inCartItem) {
          const update = {
            cart_item: {
              item_id: inCartItem.item_id,
              qty: item.qty,
              quote_id: cart.id
            }
          }
          return magento.cartUpdateItem(cart.id, inCartItem.item_id, update)
        }
        item.quoteId = quoteId
        return magento.cartAddItem(cart.id, { cart_item: item })
      })

      const results = await Promise.all(promises)
      const updatedCart = await magento.getGuestCart(quoteId)

      return exits.success(updatedCart.items)
    } catch (e) {
      console.log(e)
      return exits.error(new Error(e))
    }
  }
}

export default Machine(helper)
