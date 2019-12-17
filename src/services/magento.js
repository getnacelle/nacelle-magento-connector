import qs from 'querystrings'

import request from '../utils/request'
import config from '../../config/app'

const searchCriteriaMap = {
  limit: 'page_size',
  page: 'current_page'
}

export default class Magento {

  constructor(host, token) {
    if (!host || !token) {
      throw new Error('Host and Token required')
    }
    this.host = host
    this.token = token

    this._setConnectorHeaders()
  }

  _setConnectorHeaders() {
    this.headers = {
      Authorization: `Bearer ${this.token}`
    }
  }

  /**
   * @method getStoreConfig
   * @description load Magento store config
   *
   * @return {promise<object>} - default store
   */
  async getStoreConfig() {
    try {
      const [defaultStore] = await this.request('store/storeConfigs')
      if (!defaultStore) {
        throw new Error('Cannot find default store config')
      }

      this.storeConfig = defaultStore

      return defaultStore
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * @method getCollections
   * @description get Magento collections
   *
   * @param {object} options
   *
   * @return {promise<array>}
   */
  async getCollections({ limit = config.app.request.limit, page = 1 }) {
    const params = this.buildSearchParams({ limit, page })

    try {
      return await this.request('categories/list', params)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * @method getAllProducts
   * @description get all products from Magento store
   *
   * @param {number} batchSize
   *
   * @return {promise<array>}
   */
  async getAllProducts(batchSize) {
    try {
      const items = await this.batchFetchProducts(batchSize, 1)
      return { items }
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * @method batchFetchProducts
   * @description recursively load all products
   *
   * @param {number} batchSize
   * @param {number} page
   *
   * @return {promise<array>}
   */
  async batchFetchProducts(batchSize, page) {
    const records = []
    const {
      items,
      search_criteria: pager,
      total_count: count
    } = await this.getProducts({ limit: batchSize, page })

    records.push(...items)

    const totalPages = Math.ceil(count / pager.page_size)

    if (pager.current_page < totalPages) {
      return await this.batchFetchProducts(batchSize, pager.current_page + 1, this.headers)
    }
    return records
  }

  /**
   * @method getProducts
   * @description get products
   *
   * @param {object} options
   *
   * @return {promise<object>} - { items, search_criteria, total_count }
   */
  async getProducts({ limit = config.app.request.limit, page = 1 }) {
    const params = this.buildSearchParams({ limit, page })

    try {
      return await this.request('products', params)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async request(uri, params = {}) {
    let url = `${this.host}/${uri}`

    if (Object.keys(params).length) {
      url += `?${qs.stringify(params)}`
    }
    return await request(url, 'GET', {}, this.headers)
  }

  buildSearchParams(params) {
    const mapped = Object.keys(params).reduce((output, key) => {
      const param = searchCriteriaMap[key]
      if (!param) {
        throw new Error(`Invalid param ${param}`)
      }
      output[param] = params[key]
      return output
    }, {})

    return {
      searchCriteria: mapped
    }

    // TODO: add support for additional search params
    // searchCriteria[filterGroups][0][filters][0][field]
    // searchCriteria[filterGroups][0][filters][0][value]
    // searchCriteria[filterGroups][0][filters][0][conditionType]
    // searchCriteria[sortOrders][0][field]
    // searchCriteria[sortOrders][0][direction]
    // searchCriteria[pageSize]
    // searchCriteria[currentPage]
  }
}
