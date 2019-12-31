import Dilithium from '../services/dilithium'
import appConfig, { connector } from '../../config/app'

import { slugify, camelCase, capitalize } from '../utils/string-helpers'
import normalizer from '../normalizers/product'
import { chunk as chunker } from 'lodash'

export default {

  friendlyName: 'Push Dilithium',

  description: 'Concurrenty push items to Dilithium concurrently',

  inputs: {
    items: {
      type: 'ref',
      description: 'A list of items to push to Dilithium',
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
    resource: {
      type: 'string',
      description: 'The resource name e.x. products, collections, content',
      required: true
    },
    type: {
      type: 'string',
      description: 'The Dilithium storage type',
      defaultsTo: 'pim'
    },
    chunkSize: {
      type: 'number',
      description: 'The size of the chunk used to push to Dilithium',
      defaultsTo: 25
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({
    items,
    sourceDomain,
    orgId,
    orgToken,
    resource,
    type,
    chunkSize
  }, exits) {
    const dilithium = new Dilithium(sourceDomain, orgId, orgToken)
    const mutationName = camelCase(`index-${resource}`)
    const mutationInputName = capitalize(camelCase(`index-${resource}-input`))
    // chunk the items in to ingestible size
    const chunked = chunker(items, chunkSize)
    // return all of the remaining queries for concurrent processing
    try {
      const promises = chunked.map(chunk => {
        // create the GraphQL mutation
        const query = dilithium.buildQuery(type, resource, chunk, mutationName, mutationInputName)
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