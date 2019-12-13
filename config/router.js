import { invalidRoute, invalidRouteVerb } from './errors';
import routes from '../src/routes';

export default (app) => {
  const config = app.get('config');
  const { security: { allowedOptions }, router: { policies } } = config;

  for (let route in routes) {
    try {
      const [verb, uri] = route.split(' ');

      if (allowedOptions.indexOf(verb) === -1) {
        throw new Error(invalidRouteVerb)
      }
      const method = verb.toLowerCase();
      const controller = routes[route];

      import(`../src/controllers/${controller}`).then(internal => {
        if (internal.default && typeof internal.default === 'function') {
          app[method](uri, internal.default);
        }
      })
    } catch (e) {
      throw new Error(invalidRoute);
    }
  }

}
