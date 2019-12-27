import uuid from 'uuid'
import EventEmitter from 'events'
import Machine from 'machine'
import Timer from './timer'

import EVENTS from '../events'
import ERRORS from '../errors'

import { connector } from '../../config/app'

/**
 * Class Job
 * @extends EventEmitter
 */
export default class Job extends EventEmitter {
  /**
   * Create a new Job
   * @param {string} action The Job action to call
   * @param {object} data The data passed to the Job
   */
  constructor(action, data, wait = 0) {
    if (!action) {
      throw new Error(ERRORS.jobNameRequired)
    }
    super()
    this._id = uuid.v4()
    this.action = action
    this.wait = wait
    this.data = data
    this.jobStatus = 'idle'
    this.actionPath = '../../src/jobs'
  }

  // get the internal id for the job
  get id() {
    return this._id
  }

  // set job status idle|running|done
  set status(status) {
    this.jobStatus = status
  }

  // output job status
  get status() {
    return {
      id: this.id,
      status: this.jobStatus
    }
  }

  // get the configured wait offset and convert to seconds
  get delay() {
    return this.wait * 1000
  }

  /**
   * Import the action to perform the Job
   */
  async importAction() {
    try {
      // generate a cache key for the action
      const cacheKey = connector.cache.key('job', this.action)
      // get the cached action if exists
      const cachedAction = connector.cache.get(cacheKey)
      if (cachedAction) {
        // return the cached action if found
        return Promise.resolve(cachedAction)
      }
      // async load action
      const internal = await import(`${this.actionPath}/${this.action}`)
      const jobAction = internal.default
      connector.cache.set(cacheKey, jobAction)

      return jobAction
    } catch (e) {
      return Promise.reject(new Error(ERRORS.importJobActionFailed))
    }
  }

  /**
   * Machine pack factory
   * @return {Machine}
   */
  async pack() {
    const action = await this.importAction()
    return Machine(action)
  }

  /**
   * Update the status and notify listeners of status change
   * @param {string} status The Job status to set
   * @param {string} event The name of the event to send
   * @param {object} data The data to pass with the event
   */
  notify(status, event, data = {}) {
    this.status = status
    this.emit(event, { ...this.status, data })
  }

  /**
   * Run the Job
   * @return {Promise}
   */
  run() {
    // Since we're going to be stepping outside the event loop for a moment
    // we need to cache a ref to this, to access later withing the timeout callback
    const _this = this

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        _this.notify('running', EVENTS.jobStart)
        // start a new timer to keep track of process run
        const timer = new Timer(_this.id)
        // get the callable Machine pack
        const action = await _this.pack()
        // marck the pack time
        timer.mark(`pack ready ${_this.id}`)
        try {
          // run the async action await results
          const results = await action(_this.data)
          // stop the timer
          const finishedTimer = timer.end(_this.id)
          // tell the listeners Job jone
          _this.notify('done', EVENTS.jobComplete, { time: finishedTimer, results })
          // finally resolve the promise
          resolve({ time: finishedTimer, results })
        } catch (e) {
          _this.notify('error', EVENTS.jobError, e)
          // reject promise
          reject(new Error(e.message))
        }

      }, this.delay)
    })

  }
}
