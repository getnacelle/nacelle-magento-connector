import EventEmitter from 'events'
import hooks from '../../hooks'
import ERRORS from '../../errors'

describe('Hooks / Internal', () => {

  const emitter = new EventEmitter()
  const testHooks = hooks(emitter)
  const testEvent = 'test:event'
  const testEventData = 'test event'

  test('It receives an event it\'s waiting for', () => {

    testHooks.waitFor(testEvent, (event) => {
      expect(event).toEqual(testEventData)
    })

  })

  test('It receives an event but has no listener', () => {

    testHooks.waitFor(testEvent)
    emitter.on('hooks:error', (data) => {
      expect(data).toEqual(ERRORS.noCallback)
    })

  })

  test('It receives and event only once', () => {

    testHooks.waitFor(testEvent, true, (event) => {
      expect(event).toEqual(testEventData)
    })

  })

  test('It triggers and event with no data', () => {

    testHooks.waitFor('hooks:event:no-data', (data) => {
      expect(data).toBeUndefined()
    })

    testHooks.trigger('hooks:event:no-data')

  })

  test('It detatches event listener from emitter', () => {

    const listener = () => {}
    testHooks.waitFor(testEvent, listener)
    let listeners = emitter.listeners(testEvent)
    let hasListener = !!listeners.find(x => x === listener)

    testHooks.detatch(testEvent, listener)
    listeners = emitter.listeners(testEvent)
    hasListener = !!listeners.find(x => x === listener)

    expect(hasListener).toBe(false)

  })

  test('It relays event to main emitter', () => {

    const relayEmitter = new EventEmitter()
    testHooks.relay(relayEmitter, 'relay:event')

    emitter.on('relay:event', (event) => {
      expect(event).toEqual(testEventData)
    })

    relayEmitter.emit('relay:event', testEventData)

  })

  testHooks.trigger(testEvent, testEventData)


})