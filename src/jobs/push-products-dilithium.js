import appConfig from '../../config/app'
import normalizer from '../normalizers/product'
import Dilithium from '../services/dilithium'

export default {

  friendlyName: 'Push Products Dilithium',

  description: 'Push Products to Dilithium',

  inputs: {
    items: {
      type: 'ref',
      required: true
    },
    config: {
      type: 'ref',
      required: true
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ items, config }, exits) {
    const {
      orgId,
      orgToken,
      pimsyncsourcedomain
    } = config

    const dilithium = new Dilithium(pimsyncsourcedomain, orgId, orgToken)
    const normalized = items.map(product => normalizer(product, config))

    const query = dilithium.buildQuery('pim', 'products', normalized, 'indexProducts', 'IndexProductsInput')

    try {
      const response = await dilithium.save(...query)
      return exits.success(response)
    } catch(e) {
      return exits.error(new Error(e))
    }
  }
}
