export default class Timer {
  constructor(autostart = true) {
    this.marks = []
    if(autostart) {
      this.start()
    }
  }

  get first() {
    return this.marks[0]
  }

  get last() {
    return this.marks[this.marks.length - 1]
  }

  get total() {
    return this.last.mark - this.first.mark
  }

  mark(message = 'timer:mark') {
    this.marks.push({
      message,
      mark: Date.now()
    })
  }

  start(message = 'timer:start') {
    this.mark(message)
  }

  end(message = 'timer:end') {
    this.mark(message)
    return this.total
  }


}