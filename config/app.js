import pkg from '../package.json'

import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 3000
const BASE_PATH = process.cwd()

const {
  PORT = DEFAULT_PORT,
  NODE_ENV = 'development',
  REQUEST_LIMIT = 25,
  DILITHIUM_HOST = '',
  DILITHIUM_CLIENT_ID = '',
  DILITHIUM_TOKEN = '',
  MAGENTO_HOST = '',
  MAGENTO_TOKEN = ''
} = process.env
export const port = PORT
export const environment = NODE_ENV
export { default as connector } from '../lib/server'
export const disableXPoweredBy = false

export default {
  appName: pkg.name,
  client: 'Nacelle Magento Connector',
  environment,
  port,

  basePath: BASE_PATH,

  app: {
    request: {
      limit: REQUEST_LIMIT
    }
  },

  security: {
    // define the options available
    allowedRequestOptions: ['POST', 'GET'], // , 'PUT', 'DELETE'
    allowOrigins: '*'
  },
  router: {
    requiredHeaders: {
      // 'POST /magento/index-products': [
      //   'org-id',
      //   'org-token',
      //   'magento-token',
      //   'magento-endpoint',
      //   'pimsyncsourcedomain'
      // ]
    }
  },

  dilithium: {
    host: DILITHIUM_HOST
  }

  // use named stores
  // stores: {
  //   default: {
  //     magento: {
  //       host: MAGENTO_HOST,
  //       token: MAGENTO_TOKEN
  //     },
  //     dilithium: {
  //       host: DILITHIUM_HOST,
  //       clientId: DILITHIUM_CLIENT_ID,
  //       token: DILITHIUM_TOKEN,
  //       syncSource: 'magento',
  //       // defaults, magento connector overrides
  //       locale: 'en-us',
  //       currencyCode: 'USD'
  //     }
  //   }
  // }

}
