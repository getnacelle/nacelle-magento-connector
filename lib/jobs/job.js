import uuid from 'uuid'
import EventEmitter from 'events'
import Machine from 'machine'
import Timer from './timer'

import { app } from '../../config/app'

export const EVENTS = {
  done: 'done',
  start: 'start',
  run: 'run',
  ready: 'ready',
  error: 'error',
  complete: 'complete'
}

export default class Job extends EventEmitter {
  constructor(action, data, {
    priority = 'normal', // TODO
    wait = 0,
  }) {
    super()
    if (!action) {
      throw new Error('Job name required')
    }
    this._id = uuid.v4()
    this.priority = priority
    this.action = action
    this.wait = wait
    this.data = data
    this.jobStatus = 'idle'

    this.on('run', this.run.bind(this))
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

  async importAction() {
    try {
      const cacheKey = app.cache.key('job', this.action)
      const cachedAction = app.cache.get(cacheKey)
      if(cachedAction) {
        return Promise.resolve(cachedAction)
      }
      const internal = await import(`../../src/jobs/${this.action}`)
      app.cache.set(cacheKey, internal.default)

      return internal.default
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async pack() {
    const action = await this.importAction()
    return Machine(action)
  }

  start() {
    this.notify('running', EVENTS.start)
  }

  done(data) {
    this.notify('done', EVENTS.done, data)
  }

  error(data) {
    this.notify('failed', EVENTS.error, data)
  }

  notify(status, event, data = {}) {
    this.status = status
    this.emit(event, { ...this.status, data })
  }

  run() {
    const _this = this

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const timer = new Timer(_this.id)
        const action = await _this.pack()
        timer.mark(`pack ready ${_this.id}`)
        try {
          const response = await action(_this.data)
          const finished = timer.end(_this.id)

          _this.done({ time: finished, response })
          resolve({ time: finished, response })
        } catch (e) {
          _this.error(e)
          reject(e)
        }

      }, this.delay)
    })

  }
}
