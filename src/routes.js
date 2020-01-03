export default {
  // Indexing Routes
  'POST /magento/index-products': 'magento/index/products',
  'POST /magento/index-collections': 'magento/index/collections',
  // @deprecated use /index-content pass body param 'pages'
  'POST /magento/index-pages': 'magento/index/pages',
  'POST /magento/index-content': 'magento/index/content',
  // Cart
  'POST /magento/cart': 'magento/cart/create',
  'GET /magento/cart/:cartId': 'magento/cart/find-one',
  'PUT /magento/cart/:cartId': 'magento/cart/update',
  'DELETE /magento/cart/:cartId/items/:itemId': 'magento/cart-item/destroy',
  'GET /magento/cart/:cartId/payment-methods': 'magento/cart/payment-methods',
  'POST /magento/cart/:cartId/shipping-methods': 'magento/cart/shipping-methods',
  'POST /magento/cart/:cartId/shipping-info': 'magento/cart/shipping-info',
  // Checkout
  'POST /magento/checkout/:cartId': 'magento/checkout',
  // Orders
  'GET /magento/orders/:orderId': 'magento/order'
}
