import qs from 'querystrings'

import config from '../../config/app'
import request from '../utils/request'
import { slugify } from '../utils/string-helpers'

const searchCriteriaMap = {
  limit: 'page_size',
  page: 'current_page'
}

export default class Magento {

  constructor(host, token, secure = true) {
    if (!host || !token) {
      throw new Error('Host and Token required')
    }
    this.host = host
    this.token = token
    this._secure = secure

    this.request = this.request.bind(this)
  }

  set secure(isSecure) {
    this._secure = isSecure
  }

  get secure() {
    return this._secure
  }

  get authHeader() {
    return {
      Authorization: `Bearer ${this.token}`
    }
  }

  get storeConfig() {
    if(this._configuredStore) {
      return this._configuredStore
    }
    return this._configuredStore = {
      locale: slugify(this._storeConfig.locale),
      currencyCode: this._storeConfig.base_currency_code,
      mediaUrl: this.secure ? this._storeConfig.base_media_url : this._storeConfig.secure_base_media_url,
      staticUrl: this.secure ? this._storeConfig.base_static_url : this._storeConfig.secure_base_static_url,
      baseUrl: this.secure ? this._storeConfig.base_url : this._storeConfig.secure_base_url
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

      this._storeConfig = defaultStore

      return this.storeConfig
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
  async getCategories({ limit = config.app.request.limit, page = 1 }) {
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
