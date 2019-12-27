import Magento from '../services/magento'
import appConfig, { connector } from '../../config/app'

import { slugify } from '../utils/string-helpers'
import { makeArray } from '../utils/array-helpers'

export default {

  friendlyName: 'Fetch Products',

  description: 'Fetch Products from Magento Store',

  inputs: {
    limit: {
      type: 'number',
      defaultsTo: 300
    },
    total: {
      type: 'number',
      defaultsTo: 1
    },
    magento: {
      type: 'ref'
    },
    dilithiumConfig: {
      type: 'ref'
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ limit, total, magento, dilithiumConfig }, exits) {
    try {
      // create an array to build additional concurrent product requests
      const pending = makeArray(total)
      const promises = pending.map(idx => magento.getProducts({ limit, page: idx + 2 }))
      // request remaining pages concurrently
      const results = await Promise.all(promises)
      const items = results.reduce((o, i) => o.concat(i.items), [])

      connector.jobs.schedule('push-products-dilithium', {
        items,
        config: { ...dilithiumConfig, ...magento.storeConfig }
      })

      return exits.success(items)
    } catch (e) {
      return exits.error(e)
    }

  }
}
