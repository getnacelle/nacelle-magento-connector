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
    sourceDomain: {
      type: 'string',
      description: '',
      required: true
    },
    orgId: {
      type: 'string',
      description: '',
      required: true
    },
    orgToken: {
      type: 'string',
      description: '',
      required: true
    },
    staticUrl: {
      type: 'string',
      description: '',
      required: true
    },
    locale: {
      type: 'string',
      description: '',
      defaultsTo: 'en-us'
    },
    currencyCode: {
      type: 'string',
      description: '',
      defaultsTo: 'USD'
    }
  },

  async fn({
    items,
    sourceDomain,
    orgId,
    orgToken,
    staticUrl,
    locale,
    currencyCode
  }, exits) {

    const dilithium = new Dilithium(sourceDomain, orgId, orgToken)

    const normalized = items.map(product => normalizer(product, { staticUrl, locale, currencyCode }))
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

      return exits.success(chunked)
    } catch (e) {
      return exits.error(new Error(e))
    }
  }
}
