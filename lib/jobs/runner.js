import uuid from 'uuid'
import EventEmitter from 'events'
import Job from './job'
import Timer from './timer'

export const EVENTS = {
  done: 'done',
  start: 'start',
  run: 'run',
  ready: 'ready',
  error: 'error',
  complete: 'complete'
}

export default class Runner extends EventEmitter {
  constructor(bucket = Date.now()) {
    super()
    this._id = uuid.v4()
    this.queue = []
    this.failed = []
    this.success = []
    this.running = false
    this.bucket = bucket
  }

  get status() {
    const completed = [...this.success, ...this.failed]
    const totalTime = completed.map(x => x.data.time).sum()
    return {
      id: this.id,
      alias: this.alias,
      success: this.success.length,
      failed: this.failed.length,
      total: completed.length,
      time: totalTime > 0 ? totalTime / 1000 : totalTime
    }
  }

  get alias() {
    return this.bucket
  }

  set status(running) {
    return this.running = running
  }

  get hasPendingJobs() {
    return this.queue.length > 0
  }

  get id() {
    return this._id
  }

  add(data, options = {}) {
    // create a new job with options
    const job = new Job(this.bucket, data, options)
    job.on(EVENTS.done, this.handleJobDone.bind(this))
    job.on(EVENTS.error, this.handleJobError.bind(this))
    this.queue.push(job)
    this.start()

    return job
  }

  start() {
    this.emit(EVENTS.start)
    // process this job
    this.process()
  }

  done() {
    this.status = false
    this.emit(EVENTS.done, this.status)
  }

  process() {
    this.status = true
    const job = this.queue.shift()
    this.emit(EVENTS.run, this.status)

    job.run()
  }

  handleJobDone(job) {
    this.success.push(job)

    if (this.hasPendingJobs) {
      this.process()
    } else {
      this.done()
    }
  }

  handleJobError(e, job) {
    this.failed.push(job)
    this.emit(EVENTS.error, e)
  }

  stop() {
    this.status = false
  }
}
