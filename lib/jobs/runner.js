import uuid from 'uuid'
import EventEmitter from 'events'
import Job from './job'
import Timer from './timer'

import EVENTS from '../events'
export const STATUS = {
  idle: 'idle',
  done: 'done',
  running: 'running',
  stopped: 'stopped'
}

/**
 * Job Runner queue
 * @extends EventEmitter
 */
export default class Runner extends EventEmitter {
  /**
   * Create a Job Runner
   */
  constructor(bucket = Date.now()) {
    super()
    this._id = uuid.v4()
    this.queue = []
    this.failed = []
    this.success = []
    this.bucket = bucket
    this._status = STATUS.idle
  }

  // Return an accessor with some status data about the runner
  get status() {
    const completed = [...this.success, ...this.failed]
    console.log('completed', completed)
    const totalTime = completed.length ? completed.map(x => x.data.time).sum() : 0
    return {
      id: this.id,
      alias: this.alias,
      success: this.success.length,
      failed: this.failed.length,
      total: completed.length,
      status: this._status,
      time: totalTime > 0 ? totalTime / 1000 : totalTime
    }
  }

  // return the runner bucket
  get alias() {
    return this.bucket
  }

  // Boolean to show runner is currently running
  get running() {
    return this._status === STATUS.running
  }

  // Boolean has pending jobs
  get hasPendingJobs() {
    return this.queue.length > 0
  }

  // external accessor for _id
  get id() {
    return this._id
  }

  /**
   * Add a new Job to the runner and start
   * @param {object} data
   * @param {object} options
   *
   * @return {Job}
   */
  add(data, options = {}) {
    // create a new job with options
    const job = new Job(this.bucket, data, options)
    job.on(EVENTS.jobComplete, this.handleJobDone.bind(this))
    job.on(EVENTS.jobError, this.handleJobError.bind(this))
    this.queue.push(job)
    this.start()

    return job
  }

  /**
   * Start the runner
   */
  start() {
    this.emit(EVENTS.runnerStart)
    // process this job
    this.process()
  }

  /**
   * Runner is done
   */
  done() {
    this._status = STATUS.done
    this.emit(EVENTS.runnerDone, this.status)
  }

  /**
   * Process runner queue
   */
  process() {
    this._status = STATUS.running
    const job = this.queue.shift()
    this.emit(EVENTS.runnerStatus, this.status)

    job.run()
  }

  /**
   * Handles EVENTS.jobDone event
   * @listens {'job:done'}
   */
  handleJobDone(job) {
    this.success.push(job)

    if (this.hasPendingJobs) {
      this.process()
    } else {
      this.done()
    }
  }

  /**
   * Handles EVENTS.jobError event
   * @listens {'job:error'}
   */
  handleJobError(e, job) {
    this.failed.push(job)
    this.emit(EVENTS.runnerError, e)
  }
}
