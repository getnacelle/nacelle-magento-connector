import uuid from 'uuid'
import EventEmitter from 'events'
import Job from './job'

export const EVENTS = {
  done: 'done',
  start: 'start',
  run: 'run',
  ready: 'ready',
  error: 'error',
  complete: 'complete'
}

export default class Runner extends EventEmitter {
  constructor({
    autostart = true,
    dounce = 0,
    bucket
  } = {}) {
    super()
    this._id = uuid.v4()
    this.autostart = autostart
    this.queue = []
    this.failed = []
    this.success = []
    this.running = false
    this.bucket = bucket
    this.alias = this.bucket

    this.completed = []
  }

  get status() {
    return {
      id: this.id,
      alias: this.alias,
      running: this.running,
      success: this.success.length,
      failed: this.failed.length,
      total: this.completed.length
    }
  }

  set status(running) {
    return this.running = running
  }

  get hasPendingJobs() {
    return !!this.queue.length
  }

  get id() {
    return this._id
  }

  add(data, options = {}) {
    // if there are no pending jobs immediately process job
    if(!this.hasPendingJobs) {
      options.wait = 0
    }
    // create a new job with options
    const job = new Job(this.bucket, data, options)
    job.on(EVENTS.done, this.handleJobDone.bind(this))
    job.on(EVENTS.error, this.handleJobError.bind(this))
    console.log('runner.add', this.status)
    this.queue.push(job)
    // Check to see if autostart is selected
    // and jobs queue is not runninng
    if (this.autostart && !this.running) {
      // start the queue
      this.start()
    }
  }

  start() {
    console.log('start')
    if (this.running) {
      return
    }
    this.emit(EVENTS.start)
    // process this job
    this.process()
  }

  done() {
    console.log('done')
    this.status = false
    this.emit(EVENTS.done, this.status)
  }

  process() {
    console.log('process')
    this.status = true
    const job = this.queue[0]
    this.emit(EVENTS.run, this.status)

    job.run()
  }

  handleJobDone(job) {
    console.log('handleJobDone', job)
    const complete = this.queue.shift()
    this.completed.push(complete)
    this.success.push(job)

    if(this.hasPendingJobs) {
      this.process()
    } else {
      this.done()
    }
  }

  handleJobError(e) {
    console.log('handleJobError', e)
  }

  stop() {
    this.status = false
  }
}