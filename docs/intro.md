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

### Environment variables

Change the `default.env` file to `.env`

Configure as desired

`.env`
```bash
PORT=3000

DILITHIUM_HOST=http://index-dilithium-staging.us-east-1.elasticbeanstalk.com/

MYSQL_HOST=db
MYSQL_ROOT_PASSWORD=m5AzzFeRmb66Z7X
MYSQL_USER=nacelle_admin
MYSQL_PASSWORD=nacelle_demo
MYSQL_DATABASE=nacelle

MAGENTO_LANGUAGE=en_US
MAGENTO_TIMEZONE=America/Los_Angeles
MAGENTO_DEFAULT_CURRENCY=USD
MAGENTO_URL=http://local.magento
MAGENTO_BACKEND_FRONTNAME=admin
MAGENTO_USE_SECURE=0
MAGENTO_BASE_URL_SECURE=0
MAGENTO_USE_SECURE_ADMIN=0

MAGENTO_ADMIN_FIRSTNAME=Deanna
MAGENTO_ADMIN_LASTNAME=Troi
MAGENTO_ADMIN_EMAIL=deanna@getnacelle.com
MAGENTO_ADMIN_USERNAME=nacelle_admin
MAGENTO_ADMIN_PASSWORD=Wubbalu1*badubdub
```

### Start app


```bash
$ yarn start
```
```bash
$ npm run start
```

## Docker

### Run in Development

To run the Connector in development and watch for changed files. Uncomment the `volumes` config in the `docker-compose.yml` under `connector` service

```
volumes:
      - ~/Sites/nacelle/nacelle-magento-connector:/usr/src/app
```
`~/Sites/nacelle/nacelle-magento-connector` would be the absolute path to the repo
equal to `/Users/<username>/Sites/nacelle/nacelle-magento-connector` on Mac OSX

### Spin up the Containers

The `docker-compose.yml` file will pull in all the necessary containers to run this ecosystem

```
yarn up
```

```
npm run up
```

This process will take awhile, go grab some coffee. Maybe a bathroom break. You're looking at `>7min`

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
  "x-nacelle-space-id": "c888890c8-9999-44e3-4444-eca27cd6e6a6",
  "x-nacelle-space-token": "a3fr665a-ccc4-45ac-8877-17170bc89d42",
  "magento-endpoint": "http://local.magento/rest/all/V1",
  "magento-token": "lc2hu71d72ixgq11tu0iot0752haycvm",
  "source-domain": "magentodemo.getnacelle.com"
}
```

Sample `CURL` request

```bash
curl \
-d '{"limit": 25, "defaultLocale": "en-us", "defaultCurrencyCode": "USD"}' \
-H "Content-Type: application/json" \
-H "x-nacelle-space-id: c888890c8-9999-44e3-4444-eca27cd6e6a6" \
-H "x-nacelle-space-token: a3fr665a-ccc4-45ac-8877-17170bc89d42" \
-H "magento-endpoint: http://local.magento/rest/all/V1" \
-H "magento-token: lc2hu71d72ixgq11tu0iot0752haycvm" \
-H "source-domain": "magentodemo.getnacelle.com" \
-X POST https://connector-host.io/magento/index-products
```



## Build Coverage

```
$ yarn test && make-coverage-badge
```