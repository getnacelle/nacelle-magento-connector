import Magento from '../services/magento'
import { connector } from '../../config/app'

import normalizer from '../normalizers/product'
import helper from '../helpers/magento/concurrently-fetch-magento'

export default {

  friendlyName: 'Fetch Products Magento',

  description: 'Fetch Products from Magento Store',

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
      description: 'Limit to fetch products',
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
      // Initial fetch, retrieve Magento store config and products
      // these will run concurrently
      const promises = [
        magento.getStoreConfig(secure),
        helper({ host: magento.host, token: magento.token, type: 'products', limit })
      ]
      // assign store config and products response
      const [storeConfig, products] = await Promise.all(promises)

      const items = products.map(product => normalizer(product, { staticUrl: storeConfig.staticUrl, locale: storeConfig.locale, currencyCode: storeConfig.currencyCode }))

      // offload the dilithium push to the jobs queue
      connector.jobs.schedule('push-dilithium', {
        items,
        sourceDomain,
        orgId,
        orgToken,
        resource: 'products',
        type: 'pim'
      })

      return exits.success(items)
    } catch (e) {
      return exits.error(new Error(e))
    }

  }
}
