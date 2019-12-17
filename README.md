# nacelle-magento-connector
Nacelle connector for Magento Storefront

### Install dependencies

```
$ yarn install
```
```
$ npm install
```

### Start app


```
$ yarn start
```
```
$ npm run start
```

### Structure

```
.
├── app.js
├── bin
├── config
│   └── app.js                                    # App config
├── data
├── lib
│   ├── hooks.js                                  # Event hooks
│   ├── policies.js                               # Route middleware
│   ├── router.js                                 # App router
│   ├── server.js                                 # Server setup
│   └── utils.js                                  # Internal utils
├── src
│   ├── controllers
│   │   └── magento
│   │       ├── index-collections.js
│   │       └── index-products.js
│   ├── errors.js
│   ├── normalizers
│   │   ├── collection.js
│   │   └── product.js
│   ├── policies                                  # Route middleware handlers
│   │   └── validate-header.js
│   ├── policies.js                               # Route middleware configuration
│   ├── routes.js                                 # Route definitions
│   ├── services
│   │   ├── dilithium.js
│   │   ├── magento.js
│   │   └── store.js
│   └── utils
│       ├── camel-case.js
│       ├── request.js
│       ├── slugify.js
│       └── strip-null-empty.js
└── tests
```