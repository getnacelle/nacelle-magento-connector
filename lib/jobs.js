import JobsManager from './jobs/jobs-manager'
import EVENTS from './events'

export default (hooks) => {

  const queue = new JobsManager({ dounce: 10 })
  queue.on(EVENTS.run, (info) => hooks.trigger('job-queue:run', info))
  // when process complete let the app know
  queue.on(EVENTS.complete, (worker) => hooks.trigger(EVENTS.processComplete, worker))
  queue.on(EVENTS.done, () => hooks.trigger(EVENTS.queueComplete), queue.status)
  queue.on(EVENTS.error, (e) => hooks.trigger('job-queue:error', e))

  return { schedule: queue.schedule }
}
