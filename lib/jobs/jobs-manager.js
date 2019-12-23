import EventEmitter from 'events'
import Runner from './runner'
// import EVENTS from '../events'

export const EVENTS = {
  done: 'done',
  start: 'start',
  run: 'run',
  ready: 'ready',
  error: 'error',
  complete: 'complete'
}

export default class JobsManager extends EventEmitter {

  constructor() {
    super()

    this.runners = new Map()
    this.schedule = this.schedule.bind(this)

    this.emit(EVENTS.ready)
  }

  get status() {
    return {
      runners: this.runners.size
    }
  }

  createRunner(key) {
    if (!this.runners.has(key)) {
      const runner = new Runner({ bucket: key })
      runner.on(EVENTS.done, this.handleRunnerComplete.bind(this))
      this.runners.set(key, runner)
      return runner
    }
  }

  startRunner(key) {
    const runner = this.getRunner(key)
    if (!runner.running) {
      runner.start()
    }
  }

  getRunner(key) {
    return this.runners.get(key)
  }

  getOrCreateRunner(key) {
    const runner = this.getRunner(key)
    if (runner) {
      return runner
    }
    return this.createRunner(key)
  }

  removeRunner(key) {
    if (this.runners.has(key)) {
      this.runners.delete(key)
    }
  }

  schedule(action, data, options = {}) {
    const runner = this.getOrCreateRunner(action);
    runner.add(data, options)
  }

  handleRunnerComplete(runner) {
    console.log('handleRunnerComplete', runner)
    this.removeRunner(runner.bucket)
    // notify anyone who needs to know the status
    this.emit('job-manager:status', this.status)

  }
}
