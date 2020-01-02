import qs from 'querystrings'

import appConfig from '../../config/app'
import request from '../utils/request'
import { slugify } from '../utils/string-helpers'

import { buildSearchParams } from '../utils/magento-helpers'

export default class Magento {

  constructor(host, token, secure = true) {
    if (!host || !token) {
      throw new Error('Host and Token required')
    }
    this.host = host
    this.token = token
    this._secure = secure

    this.services = {
      customer: 'index.php',
      admin: 'all'
    }

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
    const [defaultStore] = await this.request('store/storeConfigs')
    if (!defaultStore) {
      throw new Error('Cannot find default store config')
    }

    this._storeConfig = defaultStore

    return this.storeConfig
  }

  /**
   * @method getCollections
   * @description get Magento collections
   *
   * @param {object} options
   *
   * @return {promise<array>}
   */
  async getCategories({ limit = appConfig.app.request.limit, page = 1 }) {
    const params = this.buildSearchParams({ limit, page })

    return await this.request('categories/list', params)
  }

  /**
   * @method getProducts
   * @description get products
   *
   * @param {object} options
   *
   * @return {promise<object>} - { items, search_criteria, total_count }
   */
  async getProducts({ limit = appConfig.app.request.limit, page = 1 }) {
    const params = buildSearchParams({ limit, page })

    return await this.request('products', params)
  }

  async getProductBySku(sku) {
    return await this.request(`products/${sku}`)
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

    return await this.request('cmsPage/search', params)
  }

  async getGuestCart(quoteId) {
    const url = `guest-carts/${quoteId}`;
    return await this.request(url)
  }

  async createCartQuote() {
    return await this.request('guest-carts', null, 'POST')
  }

  /**
   * Create a new Cart Quote ID
   * @return {string} Quote ID
   */
  async createCart() {
    return await this.request('carts', null, 'POST')
  }

  async cartAddItem(cartId, item) {
    const url = `guest-carts/${cartId}/items`;
    return await this.request(url, item, 'POST')
  }

  async cartUpdateItem(cartId, itemId, item) {
    const url = `carts/${cartId}/items/${itemId}`
    return await this.request(url, item, 'PUT')
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
  async request(uri, params = {}, method = 'GET') {
    let url = `${this.host}/${uri}`

    if (method === 'GET' && Object.keys(params).length) {
      url += `?${qs.stringify(params)}`
    }
    const queryParams = method === 'GET' ? {} : params
    return await request(url, method, queryParams, this.authHeader)
  }

}
