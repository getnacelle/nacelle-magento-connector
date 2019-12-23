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

    this.request = this.request.bind(this)
  }

  get authHeader() {
    return {
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

  /**
   * @method getPages
   * @description get pages
   *
   * @param {object} options
   *
   * @return {promise<object>} - { items, search_criteria, total_count }
   */
  async getPages({ limit, page }) {
    const params = this.buildSearchParams({ limit, page })

    try {
      return await this.request('cmsPage/search', params)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * @method request
   * @description ajax helper via axios
   *
   * @param {string} uri
   * @param {object} params
   *
   * @return {promise<any>}
   */
  async request(uri, params = {}) {
    let url = `${this.host}/${uri}`

    if (Object.keys(params).length) {
      url += `?${qs.stringify(params)}`
    }
    return await request(url, 'GET', {}, this.authHeader)
  }

  /**
   * @method buildSearchParams
   * @description build search params for query
   *
   * @param {object} params
   *
   * @return {object} - searchCriteria
   */
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
