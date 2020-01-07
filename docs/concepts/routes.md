# Routes

```js
export default {
  // Indexing Routes
  'POST /magento/index-products': 'magento/index/products',
  'POST /magento/index-collections': 'magento/index/collections',
  'POST /magento/index-content': 'magento/index/content',
  // Cart & Checkout Routes
  'POST /magento/cart': 'magento/cart/create',
  'GET /magento/cart/:cartId': 'magento/cart/find-one',
  'PUT /magento/cart/:cartId': 'magento/cart/update',
  'POST /magento/checkout/:cartId/total': 'magento/cart/total',
  'POST /magento/checkout/:cartId': 'magento/cart/checkout',
  // Orders
  'GET /magento/orders/:orderId': 'magento/order'
}

```