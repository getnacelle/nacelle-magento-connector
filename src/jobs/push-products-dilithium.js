import { chunk } from 'lodash'

import appConfig from '../../config/app'
import normalizer from '../normalizers/product'
import Dilithium from '../services/dilithium'

export default {

  friendlyName: 'Push Products Dilithium',

  description: 'Push Products to Dilithium',

  inputs: {
    items: {
      type: 'ref',
      required: true,
      description: 'array of items to chunk'
    },
    config: {
      type: 'ref',
      required: true,
      description: 'dilithium and magento store config'
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
    // chunk the products into chunks of 25 records
    const chunked = chunk(normalized, 25)
    // return all of the remaining queries for concurrent processing
    try {
      const promises = chunked.map(chunk => {
        // create the GraphQL mutation
        const query = dilithium.buildQuery('pim', 'products', chunk, 'indexProducts', 'IndexProductsInput')
        // save to Dilithium
        return dilithium.save(...query)
      })
      const results = await Promise.all(promises)

      return exits.success(results)
    } catch (e) {
      return exits.error(new Error(e))
    }
  }
}
