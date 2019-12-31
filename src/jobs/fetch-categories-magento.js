import Magento from '../services/magento'
import { connector } from '../../config/app'

import { bindCategoriesProducts } from '../utils/magento-helpers'
import helper from '../helpers/magento/concurrently-fetch-magento'

export default {

  friendlyName: 'Fetch Categories Magento',

  description: 'Fetch Categories from Magento Store',

  inputs: {
    magentoHost: {
      type: 'string',
      description: 'Magento API host',
      required: true
    },
    magentoToken: {
      type: 'string',
      description: 'Magento API access token',
      required: true
    },
    orgId: {
      type: 'string',
      description: 'Nacelle Organization ID',
      required: true
    },
    orgToken: {
      type: 'string',
      description: 'Nacelle Organization access token',
      required: true
    },
    sourceDomain: {
      type: 'string',
      description: 'Magento source sync domain',
      required: true
    },
    limit: {
      type: 'number',
      description: 'Limit to fetch categories',
      defaultsTo: 300
    },
    secure: {
      type: 'boolean',
      description: 'Set http or https protocol',
      defaultsTo: false
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({
    magentoHost,
    magentoToken,
    orgId,
    orgToken,
    sourceDomain,
    limit,
    secure
  }, exits) {
    try {
      const magento = new Magento(magentoHost, magentoToken)
      // Initial fetch, retrieve Magento store config, categories, products
      // these will run concurrently
      const promises = [
        magento.getStoreConfig(secure),
        helper({ host: magento.host, token: magento.token, type: 'categories', limit }),
        helper({ host: magento.host, token: magento.token, type: 'products', limit })
      ]
      // assign store config and products response
      const [ storeConfig, categories, products] = await Promise.all(promises)

      const items = bindCategoriesProducts(categories, products, storeConfig)

      connector.jobs.schedule('push-dilithium', {
        items,
        sourceDomain,
        orgId,
        orgToken,
        resource: 'collections',
        type: 'pim'
      })

      return exits.success(items)
    } catch (e) {
      return exits.error(e)
    }

  }
}