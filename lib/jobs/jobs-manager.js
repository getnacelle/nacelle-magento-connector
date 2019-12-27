import EventEmitter from 'events'
import Runner from './runner'

import EVENTS from '../events'
import ERRORS from '../errors'

/**
 * Job Runner Manager
 * @extends EventEmitter
 */
export default class JobsManager extends EventEmitter {
  /**
   * Create a Job Manager
   */
  constructor() {
    super()

    this.runners = new Map()
    this.schedule = this.schedule.bind(this)
    this.getRunner = this.getRunner.bind(this)

    this.emit(EVENTS.jobManagerReady)
  }

  /**
   * Get the Job Manager Status
   * @return {object} The Manager status
   */
  get status() {
    return {
      runners: this.runners.size
    }
  }

  /**
   * Create a new runner
   *
   * @return {Runner}
   * @throws Runner exists
   */
  createRunner(key = Date.now()) {
    if (this.runners.has(key)) {
      throw new Error(ERRORS.runnerKeyExists)
    } else {
      const runner = new Runner({ bucket: key })
      runner.on(EVENTS.runnerDone, this.handleRunnerComplete.bind(this))
      this.runners.set(key, runner)
      return runner
    }
  }

  /**
   * Start a specific runner by key
   * @param {string} key The Runner key
   */
  startRunner(key) {
    const runner = this.getRunner(key)
    if (!runner.running) {
      runner.start()
    }
  }

  /**
   * Get a specific runner by key
   * @param {string} key The Runner key
   *
   * @return {Runner}
   */
  getRunner(key) {
    return this.runners.get(key)
  }

  /**
   * Get or create a runner by key
   * @param {string} key The Runner key
   *
   * @return {Runner}
   */
  getOrCreateRunner(key) {
    const runner = this.getRunner(key)
    if (runner) {
      return runner
    }
    return this.createRunner(key)
  }

  /**
   * Remove runner by key
   * @param {string} key The Runner key
   */
  removeRunner(key) {
    if (this.runners.has(key)) {
      this.runners.delete(key)
    }
  }

  /**
   * Schedule a new Job
   * @param {string} action The name of the Job to run
   * @param {object} data The data required to process the Job
   * @param {object} options The Job options
   *
   * @return {Job}
   */
  schedule(action, data, options = {}) {
    const runner = this.getOrCreateRunner(action)
    return runner.add(data, options)
  }

  /**
   * Handle the Runner Complete event
   * @param {job:runner:done} runner The Runner status from completed
   * @listens job:runner:done
   */
  handleRunnerComplete(runner) {
    console.log('handleRunnerComplete', runner)
    this.removeRunner(runner.bucket)
    // notify anyone who needs to know the status
    this.emit(EVENTS.jobManagerStatus, this.status)

  }
}
