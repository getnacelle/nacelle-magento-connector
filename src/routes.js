export default {
  // Indexing Routes
  'POST /magento/index-products': 'magento/index/products',
  'POST /magento/index-collections': 'magento/index/collections',
  // @deprecated use /index-content pass body param 'pages'
  'POST /magento/index-pages': 'magento/index/pages',
  'POST /magento/index-content': 'magento/index/content',
  // Cart & Checkout Routes
  'POST /magento/cart': 'magento/cart/create',
  'GET /magento/cart/:id': 'magento/cart/find-one',
  'PUT /magento/cart/:id': 'magento/cart/update'
}
