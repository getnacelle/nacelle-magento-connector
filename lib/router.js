import EventEmitter from 'events'
import logger from './logger'

import config from '../config/app'
import routes from '../src/routes'

import EVENTS from './events'
import ERRORS from './errors'

class Router extends EventEmitter {

  constructor({
    policies = {},
    middleware = {}
  } = {}) {
    super()

    this._hasAllPolicy = false
    this._internal = { policies, middleware, requiredHeaders: {} }
    this.routeQueue = Object.keys(routes)
  }

  // return the assigned client
  get client() {
    return this._client || null
  }

  // get the stored policies
  get policies() {
    return this._internal.policies || {}
  }

  // get stored middleware
  get middleware() {
    return this._internal.middleware || {}
  }

  // get has all policy
  get hasAllPolicy() {
    return this._hasAllPolicy
  }

  async init(client, { policies, middleware }) {
    // logger.warn('init', client)
    this._client = client
    this._internal.policies = policies
    this._internal.middleware = middleware

    return await this.validateAllPolicy()
  }

  async loadController(controller) {
    try {
      const internal = await import(`../src/controllers/${controller}`)
      return internal.default || internal
    } catch (e) {
      logger.error('loadController', controller, e)
      return Promise.reject(e)
    }
  }

  async generateRoutes() {
    logger.debug('router.generateRoutes')
    if (this.client) {
      while (this.routeQueue.length) {
        const key = this.routeQueue.shift()
        // looking for compound string
        // ex: POST /magento/index-products
        const [verb, uri] = key.split(' ')

        try {
          this.validateRouteOption(verb)
          // define app method
          const method = verb.toLowerCase()
          // controller path
          // ex: magento/index-products
          const controllerPath = routes[key]
          // build the middleware stack
          const middlewareStack = this.buildMiddlewareStack(key)
          let controller
          // load the controller
          if(typeof controllerPath === 'string') {
            controller = await this.loadController(controllerPath)
          } else if(typeof controllerPath === 'object') {
            if(!controllerPath.controller) {
              throw new Error(ERRORS.invalidRouteController)
            }
            controller = await this.loadController(controllerPath.controller)
            // check to see if the route has requiredHeaders in the configuration
            if(controllerPath.requiredHeaders) {
              // set the route path requiredHeaders
              this._internal.requiredHeaders[key] = controllerPath.requiredHeaders
            }
          } else {
            throw new Error(ERRORS.invalidRouteConfiguration)
          }
          logger.info('generateRoutes', method, uri, middlewareStack, controller)
          // assign the route to app client
          this.client[method](uri, ...middlewareStack, controller)
          // notify listeners of status of route loading
          this.emit(EVENTS.routeLoaded, key)
        } catch (e) {
          logger.error('generateRoutes.error', key, e)
          this.emit(EVENTS.routerError, e, key)
        }
      }
      this.emit(EVENTS.routerReady)
    } else {
      throw new Error(ERRORS.appClientNotDefined)
    }
  }

  async validateAllPolicy(client) {
    const policies = Object.keys(this.policies)
    let hasAllPolicy = false
    if (policies.length) {
      hasAllPolicy = !!policies.find(x => x.startsWith('*'))
    }
    // set the has all policy
    this._hasAllPolicy = hasAllPolicy
    this.emit(EVENTS.policiesValidated)
    return this.generateRoutes(client)
  }

  buildMiddlewareStack(key) {
    logger.debug('router.buildMiddlewareStack', key)
    const stack = []

    // check if there are any middlewares to load
    if (this.hasAllPolicy) {
      stack.push(...this.loadMiddlewarePolicy('*'))
    }
    // load route specific policy stack
    if (this.policies[key]) {
      stack.push(this.loadMiddlewarePolicy(key))
    }

    return stack
  }

  getRequiredHeaders(route) {
    return this._internal.requiredHeaders[route]
  }

  loadMiddlewarePolicy(key) {
    logger.debug('router.loadMiddlewarePolicy', key)
    return this.policies[key].map(policy => {
      return this.middleware[policy]
    })
  }

  validateRouteOption(verb) {
    if (config.security.allowedRequestOptions.indexOf(verb) === -1) {
      throw new Error(ERRORS.invalidRouteVerb)
    }
  }
}

export default (app) => {
  const hooks = app.get('hooks')
  // create a new router
  const router = new Router()
  hooks.relay(router,
    // relay router specific events to the main app event bus
    EVENTS.routeLoaded,
    // when router has finished loading the router
    EVENTS.routerReady
  )
  // listen for route policies to be loaded into app config and ready for consumption
  // pass app as {client} and config
  // app.settings.router {router: { policies, middleware }}
  hooks.waitFor(EVENTS.policiesReady, async () => router
    .init(
      app,
      app.get('router')
    )
  )

  return {
    getRequiredHeaders: (route) => router.getRequiredHeaders(route)
  }

}
