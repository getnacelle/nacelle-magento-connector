export default (app) => {
  const { router: { policies } } = app.get('config')

  if (policies && policies.length) {
    policies.forEach(policy => {
      import(`../src/policies/${policy}`)
        .then(internal => {
          app.use(internal.default)
        })
    })
  }
}
