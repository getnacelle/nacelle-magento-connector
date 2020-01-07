# Nacelle Connector

Nacelle connector for Magento Storefront. Built on top of Express Engine, The Nacelle Connector is super fast and configurable.

## Intro

![Architecture](/common-connector.png)

## Structure

The primary code is located inside the `./src` directory of the app. Configuration data can me found in `./config/app.js`

```bash
.
├── Dockerfile
├── Dockerfile-dev
├── app.js
├── babel.config.js
├── bin
│   ├── build
│   ├── clean-dev
│   ├── down-dev
│   ├── start
│   ├── start-dev
│   ├── test
│   └── up-dev
├── config
│   └── app.js
├── docker-compose-dev.yml
├── docker-compose.yml
├── docs
├── jest.config.js
├── lib
│   ├── cache.js
│   ├── errors.js
│   ├── events.js
│   ├── hooks.js
│   ├── jobs
│   │   ├── job.js
│   │   ├── jobs-manager.js
│   │   ├── runner.js
│   │   └── timer.js
│   ├── jobs.js
│   ├── logger.js
│   ├── middleware
│   │   ├── all-params.js
│   │   └── validate-header.js
│   ├── router.js
│   ├── server.js
│   └── test
├── logs
├── node_modules
├── package.json
├── pm2-dev.yml
├── pm2.yml
├── public
│   └── assets
│       └── img
├── src
│   ├── controllers
│   │   └── magento
│   │       ├── cart
│   │       │   ├── checkout.js
│   │       │   ├── create.js
│   │       │   ├── find-one.js
│   │       │   ├── payment-methods.js
│   │       │   ├── shipping-methods.js
│   │       │   ├── total.js
│   │       │   └── update.js
│   │       ├── index
│   │       │   ├── collections.js
│   │       │   ├── content.js
│   │       │   ├── pages.js
│   │       │   └── products.js
│   │       └── order
│   │           └── find-one.js
│   ├── helpers
│   │   └── magento
│   │       ├── concurrently-fetch-magento.js
│   │       └── update-guest-cart.js
│   ├── jobs
│   │   ├── fetch-categories-magento.js
│   │   ├── fetch-pages-magento.js
│   │   ├── fetch-products-magento.js
│   │   └── push-dilithium.js
│   ├── normalizers
│   │   ├── collection.js
│   │   ├── page.js
│   │   └── product.js
│   ├── routes.js
│   ├── services
│   │   ├── dilithium.js
│   │   └── magento.js
│   └── utils
│       ├── array-helpers.js
│       ├── date-helpers.js
│       ├── dilithium-helpers.js
│       ├── magento-helpers.js
│       ├── normalizer-helpers.js
│       ├── object-helpers.js
│       ├── request.js
│       └── string-helpers.js
└── test
```

## Quick Start

### Install dependencies

```bash
$ yarn install
```
```bash
$ npm install
```


### Start app


```bash
$ yarn start
```
```bash
$ npm run start
```


## Stateless

Running the application stateless does come with some performance tradeoffs. Since we are not keeping any connection specific configuration within the system, each request will perform the necessary setup and authentication to complete the task at time of request. For Magento this means prefetching store configuration to properly assign asset, static references have a cache key.

> Each request requires the Connector to fetch `store/storeConfigs` from your Magento instance prior to normalizing of any data that requires specific path requirements for usage.

#### Request Headers

Open `./config/app.js` to update required headers. Setting the `requiredHeaders` in app config will automatically validate and make available to `req` object in controller via `req.validatedHeaders`

> `requiredHeaders` must be present in `./config/app.js` for stateless routes to function properly

```js
router: {
    requiredHeaders: [
      'x-nacelle-space-id',
      'x-nacelle-space-token',
      'magento-token',
      'magento-endpoint',
      'source-domain'
    ]
  }
```

```bash
{
  "magento-endpoint": "http://local.magento/rest/all/V1",
  "magento-token": "lc2hu71d72ixgq11tu0iot0752haycvm",
  "x-nacelle-space-id": "c888890c8-9999-44e3-4444-eca27cd6e6a6",
  "x-nacelle-space-token": "a3fr665a-ccc4-45ac-8877-17170bc89d42",
  "source-domain": "magentodemo.getnacelle.com"
}
```

Sample CURL request

```bash
curl \
-d '{"limit": 25, "defaultLocale": "en-us", "defaultCurrencyCode": "USD"}' \
-H "Content-Type: application/json" \
-H "magento-endpoint: http://local.magento/rest/all/V1" \
-H "magento-token: lc2hu71d72ixgq11tu0iot0752haycvm" \
-H "x-nacelle-space-id: c888890c8-9999-44e3-4444-eca27cd6e6a6" \
-H "x-nacelle-space-token: a3fr665a-ccc4-45ac-8877-17170bc89d42" \
-H "source-domain": "magentodemo.getnacelle.com" \
-X POST https://connector-host.io/magento/index-products
```



## Build Coverage

```
$ yarn test && make-coverage-badge
```