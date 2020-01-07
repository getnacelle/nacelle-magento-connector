# app.js

Basic configuration for setup

```bash
{
  appName: pkg.name,
  client: 'Nacelle Magento Connector',
  environment,
  port,

  basePath: BASE_PATH,

  app: {
    connectors: {
      magento: true,
      shopify: false
    },
    request: {
      limit: REQUEST_LIMIT
    }
  },

  security: {
    // define the options available
    allowedRequestOptions: ['POST', 'GET', 'PUT', 'DELETE'],
    allowOrigins: '*'
  },
  router: {
    requiredHeaders: []
  },

  dilithium: {
    host: DILITHIUM_HOST
  }

}
```