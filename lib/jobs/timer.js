/**
 * Benchmark Timer
 */
export default class Timer {
  /**
   * Create a new Timer
   * @param {boolean} autostart
   */
  constructor(autostart = true) {
    this.marks = []
    if (autostart) {
      this.start()
    }
  }

  // get the first mark
  get first() {
    return this.marks[0]
  }

  // get the last mark
  get last() {
    return this.marks[this.marks.length - 1]
  }

  // get the total time
  get total() {
    return this.last.mark - this.first.mark
  }

  /**
   * Add mark to the timer
   * @param {string} message
   */
  mark(message = 'timer:mark') {
    const mark = {
      message,
      mark: Date.now()
    }
    this.marks.push(mark)
    return mark
  }

  /**
   * Start the timer manually
   * @param {string} message
   */
  start(message = 'timer:start') {
    return this.mark(message)
  }

  /**
   * End the timer
   * @param {string} message
   */
  end(message = 'timer:end') {
    this.mark(message)
    return this.total
  }


}
