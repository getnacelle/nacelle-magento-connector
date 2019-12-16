import policies from './policies'
import routes from '../src/routes'
import { invalidRoute, invalidRouteVerb } from '../src/errors'

export default (app) => {
  const { security: config } = app.get('config')

  for (let route in routes) {
    try {
      const [verb, uri] = route.split(' ')

      if (config.allowedRequestOptions.indexOf(verb) === -1) {
        throw new Error(invalidRouteVerb)
      }
      const method = verb.toLowerCase()
      const controller = routes[route]

      import(`../src/controllers/${controller}`).then(internal => {
        if (internal.default && typeof internal.default === 'function') {
          app[method](uri, internal.default)
        }
      })
    } catch (e) {
      throw new Error(invalidRoute)
    }
  }

}
