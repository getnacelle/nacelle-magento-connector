export default (eventManager) => ({
  waitFor(...args) {
    const events = args.filter(x => typeof x === 'string')
    const callback = args.find(x => typeof x === 'function')
    if (!callback) {
      throw new Error('Callback not defined')
    }
    while (events.length) {
      const event = events.shift()
      eventManager.on(event, callback)
    }
  },

  trigger(event, ...data) {
    if (data) {
      eventManager.emit(event, data)
      return
    }
    eventManager.emit(event)
  }
})
