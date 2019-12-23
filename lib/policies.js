import policies from '../src/policies'

// supports both string and array policies
// validate-header
// [session-auth, validate-header]
const buildPolicyQueue = () => {
  return Object.values(policies).reduce((output, policy) => {
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
}

export default (app) => {
  // access the app hooks service
  const hooks = app.get('hooks')
  // main middleware container
  const middleware = {}

  const loadPolicyQueue = async () => {
    const policyQueue = buildPolicyQueue()

    while (policyQueue.length) {
      const policy = policyQueue.shift()

      try {
        const internal = await import(`../src/policies/${policy}`)
        hooks.trigger(`policy:loaded:${policy}`)
        middleware[policy] = internal.default
      } catch (e) {
        hooks.trigger('policy:load:error', policy, e)
      }
    }

    // prevent mutation of router object
    app.set('router', Object.freeze({ policies, middleware }))
    // trigger that the policies are ready
    hooks.trigger('policies:ready')

  }

  hooks.waitFor('app:configure', loadPolicyQueue)

}
