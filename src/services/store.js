import productNormalizer from '../normalizers/product'
import collectionNormalizer from '../normalizers/collection'
import slugify from '../utils/slugify'

export default (app) => {

  const { dilithium: config } = app.get('config')
  const { Dilithium, Magento } = app.get('services')

  return class Store {

    constructor({
      orgId,
      orgToken,
      pimsyncsourcedomain,
      magentoToken,
      magentoEndpoint,
      defaultLocale = config.locale,
      defaultCurrencyCode = config.currencyCode,
      authHeader
    }) {
      this.spaceId = orgId
      this.orgToken = orgToken
      this.syncSourceDomain = pimsyncsourcedomain
      this.locale = defaultLocale
      this.currencyCode = defaultCurrencyCode

      this.magento = new Magento(magentoEndpoint, magentoToken, authHeader)
      this.dilithium = new Dilithium(orgId, orgToken)
    }

    async indexProducts(limit) {
      await this.magento.getStoreConfig()
      try {

        const { items: products } = await this.magento.getAllProducts(limit)
        const normalizedProducts = products.map(productNormalizer)
        // const { items: data } = await this.magento.getProducts({ limit, page: 1 })
        return await this.buildQueryAndSave('products', normalizedProducts, 'indexProducts', 'IndexProductsInput')
      } catch (e) {
        return Promise.reject(e)
      }
    }

    async indexCollections({ limit, indexProducts = false }) {
      await this.magento.getStoreConfig()
      try {

        const { items: products } = await this.magento.getAllProducts(productsLimit)
        const { items: collections } = await this.magento.getCollections(limit)

        if (indexProducts) {
          const normalizedProducts = products.map(productNormalizer)
          await this.buildQueryAndSave('products', normalizedProducts, 'indexProducts', 'IndexProductsInput')
        }

        const collectionQuery = this.bindCollectionsProducts(collections, products)
        return await this.buildQueryAndSave('collections', collectionQuery, 'indexCollections', 'IndexCollectionsInput')
      } catch (e) {
        return Promise.reject(e)
      }
    }

    async buildQueryAndSave(type, data, ...operation) {
      try {

        const query = this.dilithium.buildMutation(...operation)
        const variables = {
          input: {
            pim: {
              syncSource: config.syncSource,
              syncSourceDomain: this.syncSourceDomain,
              defaultLocale: this.locale
            },
            [type]: data
          }
        }
        return await this.dilithium.save({ query, variables })
      } catch (e) {
        return Promise.reject(e)
      }
    }

    groupProductsByCollectionId(products) {
      const productGroups = {}
      for (let i = 0, n = products.length i < n i++) {
        const product = products[i]
        if (product.extension_attributes && product.extension_attributes.category_links) {
          for (let c = 0, l = product.extension_attributes.category_links.length c < l c++) {
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

    bindCollectionsProducts(collections, products) {
      const groupedProductsByCategory = this.groupProductsByCollectionId(products)
      return collections.map(collection => {
        const entiity = collectionNormalizer(collection)
        const boundProducts = groupedProductsByCategory[collection.id]
        if (boundProducts) {
          entity.products = boundProducts
        }
        return entity
      })
    }
  }
}
