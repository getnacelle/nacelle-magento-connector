import Magento from '../services/magento'
import appConfig, { app } from '../../config/app'
import { slugify } from '../utils/string-helpers'

export default {

  friendlyName: 'Fetch Products',

  description: 'Fetch Products from Magento Store',

  inputs: {
    limit: {
      type: 'number',
      defaultsTo: 300
    },
    page: {
      type: 'number',
      defaultsTo: 1
    },
    config: {
      type: 'ref'
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ limit, page, config }, exits) {
    const {
      orgId,
      orgToken,
      pimsyncsourcedomain,
      magentoToken,
      magentoEndpoint,
      defaultLocale,
      defaultCurrencyCode
    } = config

    const magento = new Magento(magentoEndpoint, magentoToken)

    // run the requests in parallel
    const promises = [
      magento.getStoreConfig(),
      magento.getProducts({ limit, page })
    ]

    try {
      const [storeConfig, products] = await Promise.all(promises)

      const {
        items,
        search_criteria: pager,
        total_count: count
      } = products

      const isSecure = appConfig.environment === 'production'

      const magentoConfig = {
        locale: slugify(storeConfig.locale),
        currencyCode: storeConfig.base_currency_code,
        mediaUrl: isSecure ? storeConfig.secure_base_media_url : storeConfig.base_media_url,
        staticUrl: isSecure ? storeConfig.secure_base_static_url : storeConfig.base_static_url,
        baseUrl: isSecure ? storeConfig.secure_base_url : storeConfig.base_url
      }

      const { jobs } = app

      // create the
      while (items.length) {
        const batch = items.splice(0, 24)
        jobs.schedule('push-products-dilithium', {
          items: batch,
          config: {
            orgId,
            orgToken,
            pimsyncsourcedomain,
            defaultLocale,
            defaultCurrencyCode,
            ...magentoConfig
          }
        })
      }

      const totalPages = Math.ceil(count / pager.page_size)

      if (pager.current_page < totalPages) {
        jobs.schedule('fetch-products-magento', {
          limit,
          page: pager.current_page + 1,
          config
        })
      }
      return exits.success('done')
    } catch (e) {
      return exits.error(e)
    }

  }
}
