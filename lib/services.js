import { capitalize } from './utils'

export default (app) => {
  // Get the services from from config
  const { services } = app.get('config')
  const appServices = {}

  services.forEach(service => {
    import(`../src/services/${service}`)
      .then(internal => {
        appServices[capitalize(service)] = internal.default(app)
      }, e => {
        console.log('load.service error', e)
      })
  })

  app.set('services', appServices)

}
