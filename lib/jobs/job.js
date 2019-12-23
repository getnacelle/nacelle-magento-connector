import uuid from 'uuid'
import EventEmitter from 'events'
import Machine from 'machine'
import Timer from './timer'

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
    if(!action) {
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

  get id() {
    return this._id
  }

  set status(status) {
    this.jobStatus = status
  }

  get status() {
    return {
      id: this.id,
      status: this.jobStatus
    }
  }

  get delay() {
    return this.wait * 1000
  }

  async importAction() {
    try {
      const internal = await import(`../../src/jobs/${this.action}`)
      return internal.default
    } catch(e) {
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
    // use setTimeout not setInterval to allow event loop to run without blocking
    setTimeout(async () => {
      const timer = new Timer(_this.id)
      const action = await _this.pack()
      timer.mark(`pack ready ${_this.id}`)
      try {
        const response = await action(_this.data)
        const finished = timer.end(_this.id)

        _this.done({ time: finished, response })
      } catch (e) {
        _this.error(e)
      }

    }, this.delay)
  }
}
