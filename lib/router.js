import config from '../config/app'
import routes from '../src/routes'
import { invalidRoute, invalidRouteVerb } from '../src/errors'

export default (app) => {
  const hooks = app.get('hooks')

  hooks.waitFor('router:load', 'policies:ready', async () => {
    const router = app.get('router')
    const hasAllPolicy = !!Object.keys(router.policies).find(x => x.startsWith('*'))
    const routeQueue = Object.keys(routes)

    while (routeQueue.length) {
      const key = routeQueue.shift()
      const [verb, uri] = key.split(' ')

      if (config.security.allowedRequestOptions.indexOf(verb) === -1) {
        throw new Error(invalidRouteVerb)
      }
      const method = verb.toLowerCase()
      const controller = routes[key]

      try {
        const internal = await import(`../src/controllers/${controller}`)
        const stack = []
        // check if there are any middlewares to load
        if(hasAllPolicy) {
          const publicStack = router.policies['*'].map(policy => {
            return router.middleware[policy]
          })
          stack.push(...publicStack)
        }
        // load route specific policy stack
        if(router.policies[key]) {
          stack.push(router.policies[key].map(policy => {
            return router.middleware[policy]
          }))
        }
        stack.push(internal.default)

        app[method](uri, ...stack)
        hooks.trigger(`router:loaded:${key}`)
      } catch(e) {
        hooks.trigger('router:load:error', key, e)
      }

    }

    hooks.trigger('router:ready')
  })

}
