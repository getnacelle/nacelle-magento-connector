import Machine from 'machine'
import Magento from '../../services/magento'
import appConfig, { connector } from '../../../config/app'

const helper = {

  friendlyName: 'Create a new Cart',

  description: 'Create a new Customer Cart in Magento',

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
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ host, token }, exits) {
    const magento = new Magento(host, token)

    try {

      const promises = [
        magento.createCart(),
        // for anonymous users
        magento.createCartQuote()
      ]

      const [cartId, quoteId] = await Promise.all(promises)

      return exits.success({ quoteId })
    } catch (e) {
      return exits.error(new Error(e))
    }
  }
}

export default Machine(helper)
