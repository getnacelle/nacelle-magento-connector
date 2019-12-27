import Machine from 'machine'
import Magento from '../../services/magento'
import appConfig, { connector } from '../../../config/app'

import { slugify } from '../../utils/string-helpers'
import normalizer from '../../normalizers/product'

const helper = {

  friendlyName: 'Push Products to Dilithium',

  description: 'Normalize Products and push them to Dilithium concurrently',

  inputs: {
    products: {
      type: 'ref',
      description: 'A list of products from Magento'
      required: true
    },
    sourceDomain: {
      type: 'string',
      description: 'The Magento host you are syncing from',
      required: true
    },
    orgId: {
      type: 'string',
      description: 'Nacelle Space ID',
      required: true
    },
    orgToken: {
      type: 'string',
      description: 'Nacelle Store Token',
      required: true
    },
    staticUrl: {
      type: 'string',
      description: 'Magento static url for media objects, e.g. images',
      required: true
    },
    locale: {
      type: 'string',
      description: 'The store locale',
      defaultsTo: 'en-us'// TODO: get from config
    },
    currentyCode: {
      type: 'string',
      description: '',
      defaultTo: 'USD'// TODO: get from config
    },
    chunkSize: {
      type: 'number',
      description: 'The size of the chunk used to push to Dilithium',
      defaultTo: 25
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({
    items,
    sourceDomain ,
    orgId,
    orgToken,
    staticUrl,
    locale,
    currentyCode,
    chunkSize
  }, exits) {
    const dilithium = new Dilithium(sourceDomain, orgId, orgToken)

    const normalized = items.map(product => normalizer(product, { locale, currentyCode, staticUrl }))
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

export default Machine(helper)
