import { noCallback } from '../src/errors'

/**
 * Create a Factory interface to add multi-string event listening
 * functionality to app by abstracting access to main event bus
 *
 * @params {EventEmitter} eventManager - App level Event Manager
 */
export default (eventManager) => ({

  /**
   * Wait for specified events triggered
   * in event manager
   *
   * @param {(...string|function)} args
   * @param {string[]} args.events - string(s) representing events to listen to
   * @param {function} args.listener - required: listener function to call when event has been triggered
   *
   * @example:
   *    hooks.waitFor('app:ready', listener)
   *    hooks.waitFor('app:init', 'app:progress', 'app:ready', listener)
   */
  waitFor(...args) {
    const events = args.filter(x => typeof x === 'string')
    const listener = args.find(x => typeof x === 'function')
    const once = args.find(x => typeof x === 'boolean')
    if (!listener) {
      throw new Error(noCallback)
    }
    while (events.length) {
      // Completely detatch event from initial scope
      const event = events.shift()
      if(once) {
        eventManager.once(event, listener)
      } else {
        eventManager.on(event, listener)
      }

    }
  },

  /**
   * Triggers Event Manager event with associated
   * data. Data uses rest parameters, and can contain
   * any type of node: string|array|object|function|boolean
   *
   * @params {string} event - event string to trigger
   * @params {any} data - data passed to event handlers, can contain
   *      any type of structure Array|string|number|boolean|object.
   *      A function could technically be passed, if you wanted to execute
   *      it upstream in the event handler
   *
   * @example:
   *    hooks.trigger('app:ready')
   *    hooks.trigger('router:loaded:index-collections')
   *    hooks.trigger('job:add', job)
   */
  trigger(event, ...data) {
    if (data) {
      eventManager.emit(event, ...data)
      return
    }
    eventManager.emit(event)
  },

  detatch(event, listener) {
    eventManager.off(event, listener)
  }
})
