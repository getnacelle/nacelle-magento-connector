import JobsManager from './jobs/jobs-manager'
import EVENTS from './events'

export default (hooks) => {

  const queue = new JobsManager()

  // use the hooks relay to push these events into the main bus
  hooks.relay(queue,
    EVENTS.jobManagerStatus,
    EVENTS.runnerDone,
    EVENTS.runnerError
  )

  // expose actions to app
  return {
    schedule: (action, data, options) => queue.schedule(action, data, options),
    getRunner: (key) => queue.getRunner(key)
  }
}
