import qs from 'querystrings'

export default (app) => {
  const utils = app.get('utils')
  const { app: { request: config } } = app.get('config')

  return class Magento {

    constructor(host, token, headers = {}) {
      if (!host || !token) {
        throw new Error('Host and Token required')
      }
      this.host = host
      this.token = token
      this.headers = headers
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
    async getCollections({ limit = config.limit, page = 1 }) {
      const params = {
        searchCriteria: {
          page_size: limit,
          current_page: page
        }
      }

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
    async getProducts({ limit = config.limit, page = 1 }) {
      const params = {
        searchCriteria: {
          page_size: limit,
          current_page: page
        }
      }

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
      return await utils.request(url, 'GET', {}, this.headers)
    }
  }

}
