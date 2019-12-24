import uuid from 'uuid'

import appConfig, { app } from '../../config/app'

import productNormalizer from '../normalizers/product'
import collectionNormalizer from '../normalizers/collection'
import pageNormalizer from '../normalizers/page'

import Magento from '../services/magento'
// import Dilithium from '../services/dilithium'

import { slugify } from '../utils/string-helpers'
import { makeArray } from '../utils/array-helpers'

const IGNORE_CATEGORIES = ['Root Catalog', 'Default Category']

export default class Store {

  constructor({
    orgId,
    orgToken,
    pimsyncsourcedomain,
    magentoToken,
    magentoEndpoint,
    defaultLocale,
    defaultCurrencyCode
  }) {
    this.secure = appConfig.environment === 'production'
    this.locale = defaultLocale
    this.currencyCode = defaultCurrencyCode

    this.magento = new Magento(magentoEndpoint, magentoToken)
    this.dilithium = { orgId, orgToken, pimsyncsourcedomain }
  }

  async indexProducts(limit) {
    // Initial fetch, retrieve Magento store config and first page of products
    // these will run concurrently
    const promises = [
      this.magento.getStoreConfig(this.secure),
      this.magento.getProducts({ limit, page: 1 })
    ]

    // assign store config and products response
    const [storeConfig, {
      items,
      search_criteria: pager,
      total_count: count
    }] = await Promise.all(promises)

    const instanceConfig = { ...this.magento.storeConfig, ...this.dilithium }
    // offload the dilithium push to the jobs queue
    app.jobs.schedule('push-products-dilithium', {
      items,
      config: instanceConfig
    })

    // get the total pages contained in Magento store
    const totalPages = Math.ceil(count / pager.page_size)

    // check to see if there are more pages
    if (pager.current_page < totalPages) {
      const remainingPages = totalPages - 1
      app.jobs.schedule('fetch-products-magento', {
        limit,
        total: remainingPages,
        magento: this.magento,
        dilithiumConfig: this.dilithium
      })
    }

    return Promise.resolve()
  }
}
