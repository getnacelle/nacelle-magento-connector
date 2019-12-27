import Magento from '../services/magento'
import appConfig, { connector } from '../../config/app'

import { slugify } from '../utils/string-helpers'
import { makeArray } from '../utils/array-helpers'

import helper from '../helpers/magento/concurrently-fetch-magento'

export default {

  friendlyName: 'Fetch Products',

  description: 'Fetch Products from Magento Store',

  inputs: {
    magentoHost: {
      type: 'string',
      description: '',
      required: true
    },
    magentoToken: {
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
    sourceDomain: {
      type: 'string',
      description: '',
      required: true
    },
    limit: {
      type: 'number',
      defaultsTo: 300
    },
    secure: {
      type: 'boolean',
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
      // create an array to build additional concurrent product requests
      // Initial fetch, retrieve Magento store config and first page of products
      // these will run concurrently
      const promises = [
        magento.getStoreConfig(secure),
        helper({ host: magento.host, token: magento.token, type: 'products', chunk: limit })
      ]
      // assign store config and products response
      const [storeConfig, products] = await Promise.all(promises)

      // offload the dilithium push to the jobs queue
      connector.jobs.schedule('push-products-dilithium', {
        items: products,
        locale: storeConfig.locale,
        currencyCode: storeConfig.currencyCode,
        staticUrl: storeConfig.staticUrl,
        sourceDomain,
        orgId,
        orgToken
      })

      return exits.success(products)
    } catch (e) {
      return exits.error(e)
    }

  }
}
