const gobalRequiredHeaders = [
  'magento-host',
  'magento-token'
]
const indexingHeaders = [
  ...gobalRequiredHeaders,
  'x-nacelle-space-id',
  'x-nacelle-space-token',
  'source-domain'
]

export default {
  // Indexing Routes
  'POST /magento/index-products': {
    controller: 'magento/index/products',
    requiredHeaders: indexingHeaders
  },
  'POST /magento/index-collections': {
    controller: 'magento/index/collections',
    requiredHeaders: indexingHeaders
  },
  // @deprecated will remove 0.1.0 use /index-content pass body param 'pages'
  'POST /magento/index-pages': {
    controller: 'magento/index/pages',
    requiredHeaders: indexingHeaders
  },
  'POST /magento/index-content': {
    controller: 'magento/index/content',
    requiredHeaders: indexingHeaders
  },
  // Cart
  'POST /magento/cart': {
    controller: 'magento/cart/create',
    requiredHeaders: gobalRequiredHeaders
  },
  'GET /magento/cart/:cartId': {
    controller: 'magento/cart/find-one',
    requiredHeaders: gobalRequiredHeaders
  },
  'PUT /magento/cart/:cartId': {
    controller: 'magento/cart/update',
    requiredHeaders: gobalRequiredHeaders
  },
  'GET /magento/cart/:cartId/payment-methods': {
    controller: 'magento/cart/payment-methods',
    requiredHeaders: gobalRequiredHeaders
  },
  'POST /magento/cart/:cartId/shipping-methods': {
    controller: 'magento/cart/shipping-methods',
    requiredHeaders: gobalRequiredHeaders
  },
  'POST /magento/cart/:cartId/total': {
    controller: 'magento/cart/total',
    requiredHeaders: gobalRequiredHeaders
  },
  // Checkout
  'POST /magento/checkout/:cartId': {
    controller: 'magento/cart/checkout',
    requiredHeaders: gobalRequiredHeaders
  },
  // Orders
  'GET /magento/orders/:orderId': {
    controller: 'magento/order/find-one',
    requiredHeaders: gobalRequiredHeaders
  }
}
