import EventEmitter from 'events'

import config from '../config/app'
import routes from '../src/routes'
import { invalidRoute, invalidRouteVerb } from '../src/errors'

export const EVENTS = {
  policiesValidated: 'policies:validated',
  routeLoaded: 'route:loaded',
  done: 'done',
  error: 'error'
}

class Router extends EventEmitter {

  constructor({
    policies = {},
    middleware = {}
  } = {}) {
    super()

    this._internal = { policies, middleware }
    this.routeQueue = Object.keys(routes)
  }

  get client() {
    return this._client || null
  }

  set client(context) {
    this._client = context
  }

  get namespace() {
    return this.constructor.name
  }

  get policies() {
    return this._internal.policies || {}
  }

  set policies(config) {
    this._internal.policies = config
  }

  get middleware() {
    return this._internal.middleware || {}
  }

  set middleware(handlers) {
    this._internal.middleware = handlers
  }

  get hasAllPolicy() {
    return Boolean(this._hasAllPolicy) ? this._hasAllPolicy : false
  }

  set hasAllPolicy(hasAllPolicy) {
    this._hasAllPolicy = hasAllPolicy
  }

  async init(client, { policies, middleware }) {
    // await this.generateRoutes()
    this.client = client
    this.policies = policies
    this.middleware = middleware

    this.on(EVENTS.policiesValidated, this.generateRoutes.bind(this))

    this.validateAllPolicy()
    var something = this.namespace
  }

  async loadController(controller) {
    this.log('%s.loadController', this.namespace, controller)
    try {
      return await import(`../src/controllers/${controller}`)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async generateRoutes() {
    this.log('%s.generateRoutes', this.namespace)

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
          // load the controller
          const controller = await this.loadController(controllerPath)
          // // assign the route to app client
          this.client[method](uri, ...middlewareStack, controller.default)
          // // notify listeners of status of route loading
          this.emit(EVENTS.routeLoaded, key)
        } catch (e) {
          this.log('%s.generateRoutes.error', this.namespace, e)
          this.emit(EVENTS.error, e, key)
        }
      }
      this.emit(EVENTS.done)
    } else {
      throw new Error('App client not defiend')
    }
  }

  validateAllPolicy() {
    const policies = Object.keys(this.policies)
    let hasAllPolicy = false
    if (policies.length) {
      hasAllPolicy = !!policies.find(x => x.startsWith('*'))
    }
    // set the has all policy
    this.hasAllPolicy = hasAllPolicy

    this.emit(EVENTS.policiesValidated)
  }

  buildMiddlewareStack(key) {
    this.log('%s.buildMiddlewareStack', this.namespace, key)
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

  loadMiddlewarePolicy(key) {
    this.log('%s.loadMiddlewarePolicy', this.namespace, key)
    return this.policies[key].map(policy => {
      return this.middleware[policy]
    })
  }

  validateRouteOption(verb) {
    if (config.security.allowedRequestOptions.indexOf(verb) === -1) {
      throw new Error(invalidRouteVerb)
    }
  }

  log(...data) {
    this.emit('log', ...data)
    console.log(...data)
  }
}

export default (app) => {
  // app wide hooks
  const hooks = app.get('hooks')

  const router = new Router()
  // relay router specific events to the main app event bus
  router.on('route:loaded', (key) => hooks.trigger(`router:loaded:${key}`))
  // when router has finished loading the router
  // trigger an app wide event router ready
  router.on('done', () => hooks.trigger('router:ready'))
  // listen for route policies to be loaded into app config and ready for consumption
  // pass app as {client} and config
  // app.settings.router {router: { policies, middleware }}
  hooks.waitFor('policies:ready', () => router
    .init(
      app,
      app.get('router')
    )
  )

}
