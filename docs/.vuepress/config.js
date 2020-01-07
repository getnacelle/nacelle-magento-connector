module.exports = {
  title: 'Nacelle Connector',
  description: 'Documentation',
  ga: 'UA-147132429-3',
  themeConfig: {
    sidebar: [
      {
        title: 'Overview',
        collapsable: false,
        children: [
          '/intro'
        ]
      },
      {
        title: 'App Config',
        collapsable: false,
        children: [
          '/app-config'
        ]
      },
      {
        title: '/lib',
        collapsable: false,
        children: [
          '/lib/cache',
          '/lib/router',
          '/lib/events',
          '/lib/errors',
          '/lib/hooks',
          '/lib/jobs',
          '/lib/job-manager',
          '/lib/runner',
          '/lib/job',
          '/lib/server',
          '/lib/utils'
        ]
      },
      {
        title: 'Concepts',
        collapsable: false,
        children: [
          '/concepts/jobs',
          '/concepts/controllers',
          '/concepts/routes',
          '/concepts/helpers',
          '/concepts/normalizers',
          '/concepts/services',
          '/concepts/utils'
        ]
      },
      {
        title: 'Indexing',
        collapsable: false,
        children: [
          '/index-products',
          '/index-collections',
          '/index-content'
        ]
      },
      {
        title: 'Cart',
        collapsable: false,
        children: [
          '/cart/create-cart',
          '/cart/update-cart',
          '/cart/shipping-methods',
          '/cart/cart-total',
          '/cart/checkout'
        ]
      },
      {
        title: 'Development',
        collapsable: false,
        children: [
          '/development/demo-store', 
          '/development/manual-store-setup', 
          '/development/dev-docker', 
          '/development/testing'
        ]
      }
    ],
    nav: [{ text: 'Nacelle', link: 'https://getnacelle.com' }]
  }
};
