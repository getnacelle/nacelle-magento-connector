import Timer from '../../jobs/timer'

describe('Timer / Internal / Jobs', () => {

  describe('It created a timer that autostarts', () => {

    const timer = new Timer()

    test('It created an autostart timer', () => {
      expect(timer.marks.length).toBe(1)
    })

    test('It ended the autostarted timer', () => {
      timer.end()
      expect(timer.marks.length).toBe(2)
    })

  })

  describe('It created a start controlled timer', () => {

    const timer = new Timer(false)

    test('It created a new timer that has not started', () => {
      expect(timer.marks.length).toBe(0)
    })


    test('It started the timer', () => {
      timer.start()
      expect(timer.marks.length).toBe(1)
    })

    test('It created a time mark in the timer', () => {
      timer.mark()
      expect(timer.marks.length).toBe(2)
    })

    test('It ended the start controlled timer', () => {
      timer.end()
      expect(timer.marks.length).toBe(3)
    })


  })


})