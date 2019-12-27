import Machine from 'machine'
import Magento from '../../services/magento'
import appConfig, { connector } from '../../../config/app'

import { slugify } from '../../utils/string-helpers'
import { makeArray } from '../../utils/array-helpers'

const actionMap = {
  categories: 'getCategories',
  pages: 'getPages',
  products: 'getProducts'
}

const helper = {

  friendlyName: 'Fetch Products',

  description: 'Fetch Products from Magento Store',

  inputs: {
    host: {
      type: 'string',
      required: true,
      description: ''
    },
    token: {
      type: 'string',
      required: true,
      description: ''
    },
    type: {
      type: 'string',
      required: true,
      description: ''
    },
    chunk: {
      type: 'number',
      defaultsTo: 1,
      description: ''
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({ host, token, type, limit: limit }, exits) {
    // Init Magento service
    const magento = new Magento(host, token)
    // get process action
    const action = magento[actionMap[type]]
    if (!action || typeof action !== 'function') {
      return exits.error(new Error('Invalid Type'))
    }
    try {
      const {
        // get the product items
        items,
        // assign the search_criteria attribute to pager
        search_criteria: pager,
        // assign the total_count attribute to count
        total_count: count
      } = await action({ limit, page: 1 })
      // get the total pages contained in Magento store
      const totalPages = Math.ceil(count / pager.page_size)

      // check to see if there are more pages
      if (pager.current_page < totalPages) {
        // create an array to map the remaining requests
        const pending = makeArray(total)
        // the promises to run concurrently
        const promises = pending.map(idx => action({ limit, page: idx + 2 }))
        // request remaining pages concurrently
        const results = await Promise.all(promises)
        items.push(...results.reduce((o, i) => o.concat(i.items), []))
      }

      return exits.success(response)
    } catch (e) {
      return exits.error(e)
    }

  }
}

export default Machine(helper)
