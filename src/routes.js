const requiredStoreHeaders = [
  'org-id',
  'org-token',
  'magento-token',
  'magento-endpoint',
  'pimsyncsourcedomain'
]

export default {
  'GET /': 'magento/manager',
  'POST /magento/index-products': {
    controller: 'magento/index-products',
    requiredHeaders: requiredStoreHeaders
  },
  'POST /magento/index-collections': {
    controller: 'magento/index-collections',
    requiredHeaders: requiredStoreHeaders
  },
  'POST /magento/index-pages': {
    controller: 'magento/index-pages',
    requiredHeaders: requiredStoreHeaders
  }
}
