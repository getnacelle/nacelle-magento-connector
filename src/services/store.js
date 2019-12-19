import productNormalizer from '../normalizers/product'
import collectionNormalizer from '../normalizers/collection'
import pageNormalizer from '../normalizers/page'

import appConfig from '../../config/app'
import Magento from '../services/magento'
import Dilithium from '../services/dilithium'

import slugify from '../utils/slugify'

const IGNORE_CATEGORIES = ['Root Catalog', 'Default Category']

export default class Store {

  constructor({
    orgId,
    orgToken,
    pimsyncsourcedomain,
    magentoToken,
    magentoEndpoint,
    defaultLocale = slugify(appConfig.dilithium.locale),
    defaultCurrencyCode = appConfig.dilithium.currencyCode,
    authHeader
  }) {
    this.secure = appConfig.environment === 'production'
    this.spaceId = orgId
    this.orgToken = orgToken
    this.syncSourceDomain = pimsyncsourcedomain
    this.locale = defaultLocale
    this.currencyCode = defaultCurrencyCode

    this.magento = new Magento(magentoEndpoint, magentoToken)
    this.magento.header = authHeader
    this.dilithium = new Dilithium(appConfig.dilithium.host, orgId, orgToken)
  }

  async getMagentoConfig() {
    const storeConfig = await this.magento.getStoreConfig()

    return {
      locale: slugify(storeConfig.locale),
      currencyCode: storeConfig.base_currency_code,
      mediaUrl: this.secure ? storeConfig.base_media_url : storeConfig.secure_base_media_url,
      staticUrl: this.secure ? storeConfig.base_static_url : storeConfig.secure_base_static_url,
      baseUrl: this.secure ? storeConfig.base_url : storeConfig.secure_base_url
    }
  }

  async indexProducts(limit) {
    try {
      const config = await this.getMagentoConfig()
      // const { items: products } = await this.magento.getAllProducts(limit)
      const { items: products } = await this.magento.getProducts({ limit, page: 1 })

      const normalizedProducts = products.map(product => productNormalizer(product, config))
      return await this.buildQueryAndSave('pim', 'products', normalizedProducts, 'indexProducts', 'IndexProductsInput')
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async indexCollections({ limit, productLimit, indexProducts = false }) {
    try {
      const config = await this.getMagentoConfig()
      // const { items: products } = await this.magento.getAllProducts(limit)
      const { items: products } = await this.magento.getProducts({ limit, page: 1 })
      const { items: collections } = await this.magento.getCollections({ limit })

      if (indexProducts) {
        const normalizedProducts = products.map(product => productNormalizer(product, config))
        await this.buildQueryAndSave('products', normalizedProducts, 'indexProducts', 'IndexProductsInput')
      }

      // the magento category/list endpoint does not adhere to page_size param, need to slice list to workaround
      const collectionQuery = this.bindCollectionsProducts(collections.slice(0, limit), products, config)
      return await this.buildQueryAndSave('pim', 'collections', collectionQuery, 'indexCollections', 'IndexCollectionsInput')
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async indexPages({ limit, page = 1 }) {
    try {
      const config = await this.getMagentoConfig()
      const { items: pages } = await this.magento.getPages({ limit, page })

      const normalizedPages = pages.map(cmsPage => pageNormalizer(cmsPage, config))
      return await this.buildQueryAndSave('cms', 'content', normalizedPages, 'indexContent', 'IndexContentInput')
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async buildQueryAndSave(ref, type, data, mutationName, inputType) {
    try {
      const query = this.dilithium.buildMutation(mutationName, inputType)
      const variables = {
        input: {
          [ref]: {
            syncSource: appConfig.dilithium.syncSource,
            syncSourceDomain: this.syncSourceDomain,
            defaultLocale: this.locale
          },
          [type]: data
        }
      }
      return await this.dilithium.save(query, variables)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  ignoreCategories(categories, ...ignore) {
    return ignore.length ? categories.filter(x => ignore.indexOf(x.name) === -1) : categories
  }

  groupProductsByCollectionId(products) {
    const productGroups = {}
    for (let i = 0, n = products.length; i < n; i++) {
      const product = products[i]
      if (product.extension_attributes && product.extension_attributes.category_links) {
        for (let c = 0, l = product.extension_attributes.category_links.length; c < l; c++) {
          const { category_id: id } = product.extension_attributes.category_links[c]
          if (!productGroups[id]) {
            productGroups[id] = []
          }
          productGroups[id].push(slugify(product.name))
        }
      }
    }
    return productGroups
  }

  bindCollectionsProducts(collections, products, config) {
    const groupedProductsByCategory = this.groupProductsByCollectionId(products)
    return this.ignoreCategories(collections, ...IGNORE_CATEGORIES)
      .map(collection => {
        const entity = collectionNormalizer(collection, config)
        const boundProducts = groupedProductsByCategory[collection.id]
        if (boundProducts) {
          entity.productLists.push({
            title: 'default',
            slug: 'default',
            locale: this.locale,
            handles: boundProducts
          })
        }
        return entity
      })
  }
}
