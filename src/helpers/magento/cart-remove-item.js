import Machine from 'machine'
import Magento from '../../services/magento'
import appConfig, { connector } from '../../../config/app'

const helper = {

  friendlyName: 'Cart Remove Item',

  description: 'Remove Item from Cart',

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
    itemId: {
      type: 'number',
      description: 'Item ID in Cart',
      required: true
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ host, token, quoteId, itemId }, exits) {
    const magento = new Magento(host, token)

    try {
      // get the cart so we can get the cart id
      const cart = await magento.getGuestCart(quoteId)
      // remove the item from the cart
      const result = await magento.cartRemoveItem(cart.id, itemId)
      // send back the items
      return exits.success(result)
    } catch (e) {
      return exits.error(new Error(e))
    }
  }
}

export default Machine(helper)
