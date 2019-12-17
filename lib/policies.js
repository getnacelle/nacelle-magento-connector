import policies from '../src/policies'

export default (app) => {

  const hooks = app.get('hooks')

  hooks.waitFor('app:configure', async () => {
    const middleware = {}
    // supports both string and array policies
    // validate-header
    // [session-auth, validate-header]
    const loadPolicyQueue = Object.values(policies).reduce((output, policy) => {
      if (typeof policy === 'string') {
        if (output.indexOf(routePolicy) === -1) {
          output.push(policy)
        }
      } else if (Array.isArray(policy)) {
        policy.forEach(routePolicy => {
          if (output.indexOf(routePolicy) === -1) {
            output.push(routePolicy)
          }
        })
      }
      return output
    }, [])

    while (loadPolicyQueue.length) {
      const policy = loadPolicyQueue.shift()

      try {
        const internal = await import(`../src/policies/${policy}`)
        hooks.trigger(`policy:loaded:${policy}`)
        middleware[policy] = internal.default
      } catch (e) {
        hooks.trigger('policy:load:error', policy, e)
      }
    }

    app.set('router', { policies, middleware })
    hooks.trigger('policies:ready')

  })


}
