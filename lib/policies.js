import policies from '../src/policies'
import logger from './logger'

import EVENTS from './events'

// supports both string and array policies
// validate-header
// [session-auth, validate-header]
const buildPolicyQueue = () => {
  logger.debug('buildPolicyQueue')
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

const asyncImportPolicy = async (policy) => {
  logger.debug('asyncImportPolicy')
  const internal = await import(`../src/policies/${policy}`)
  return internal.default || internal
}

export default (app) => {
  // access the app hooks service
  const hooks = app.get('hooks')
  // main middleware container
  const middleware = {}

  const loadPolicyQueue = async () => {
    const policyQueue = buildPolicyQueue()

    logger.debug('loadPolicyQueue', policyQueue)
    while (policyQueue.length) {
      const policy = policyQueue.shift()
      try {
        const policyAction = await asyncImportPolicy(policy)
        hooks.trigger(EVENTS.policyLoaded, policy)
        logger.debug(EVENTS.policyLoaded, policy)
        middleware[policy] = policyAction
      } catch (e) {
        hooks.trigger(EVENTS.policiesError, e, policy)
        logger.error(EVENTS.policiesError, policy, e)
      }
    }
    // prevent mutation of router object
    app.set('router', Object.freeze({ policies, middleware }))
    // trigger that the policies are ready
    hooks.trigger(EVENTS.policiesReady)

  }

  hooks.waitFor(EVENTS.appConfigure, loadPolicyQueue)

}
