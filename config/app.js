import pkg from '../package.json'

import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 3000
const DEFAULT_DILITHIUM_HOST = 'https://hailfrequency.com/graphql/v1/space'

const {
  PORT = DEFAULT_PORT,
  NODE_ENV = 'development',
  REQUEST_LIMIT = 25,
  DILITHIUM_HOST = DEFAULT_DILITHIUM_HOST
} = process.env

export const port = PORT
export const environment = NODE_ENV

export default {
  appName: pkg.name,
  client: 'Nacelle Magento Connector',
  environment,
  port,

  app: {
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
    // define middleware run before router
    policies: ['validate-header', 'session-auth'],
    requiredHeaders: [
      'org-id',
      'org-token',
      'magento-token',
      'magento-endpoint',
      'pimsyncsourcedomain'
    ]
  },
  // dilithium defaults
  dilithium: {
    host: DILITHIUM_HOST,
    syncSource: 'magento',
    locale: 'en-us',
    currencyCode: 'USD'
  },
  // in app services available via app.get('services')
  services: ['dilithium', 'magento']
}
