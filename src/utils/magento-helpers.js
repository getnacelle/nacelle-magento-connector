import collectionNormalizer from '../normalizers/collection'
import { slugify } from './string-helpers'

export const IGNORE_CATEGORIES = ['Root Catalog', 'Default Category']

/**
 * Group the Products by Category ID
 * @param {array} products The array of products to group by ID
 * @return {object}
 */
export const groupProductsByCategoryId = (products) => {
  const productGroups = {}
  // loop through all of the products given
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

/**
 * Ignore specific categories from being processed
 * @param {array} categories
 * @param {...string} ignore The names of the categories to ignore
 */
const ignoreCategories = (categories, ...ignore) => {
  return ignore.length ? categories.filter(x => ignore.indexOf(x.name) === -1) : categories
}

/**
 * Bind the Products to their respective Categories
 * @param {array} categories
 * @param {array} products
 * @param {object} config
 * @return {array}
 */
export const bindCategoriesProducts = (categories, products, config) => {
  const filteredProducts = products.filter(x => x.name)
  const groupedProductsByCategory = groupProductsByCategoryId(filteredProducts)
  return ignoreCategories(categories, ...IGNORE_CATEGORIES)
    .map(category => {
      const entity = collectionNormalizer(category, config)

      const boundProducts = groupedProductsByCategory[category.id]
      if (boundProducts) {
        entity.productLists.push({
          title: 'default',
          slug: 'default',
          locale: config.locale,
          handles: boundProducts
        })
      }
      return entity
    })
}
