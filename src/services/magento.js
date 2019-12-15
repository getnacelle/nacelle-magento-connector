import qs from 'querystrings'

export default (app) => {
  const utils = app.get('utils')
  const { app: { request: config } } = app.get('config')

  return class Magento {

    constructor (host, token) {
      if(!host || !token) {
        throw new Error('Host and Token required')
      }
      this.host = host
      this.token = token
    }

    /**
     * @method getProducts
     * @description
     *
     * @param {object} options
     * @param {object} headers
     *
     * @return {promise<object>} - { items, search_criteria, total_count }
     */
    async getProducts({ limit = config.limit, page = 1 }, headers) {
      const query = qs.stringify({
        searchCriteria: {
          page_size: limit,
          current_page: page
        }
      })
      const url = `${this.host}/products?${query}`

      try {
        return await utils.request(url, 'GET', {}, headers)
      } catch (e) {
        console.log('getProducts', e);
        return Promise.reject(e)
      }
    }
  }

}
