import Runner, { STATUS } from '../../jobs/runner'

describe('Runner / Internal / Jobs', () => {

  const testBucket = 'test'
  const testRunner = new Runner(testBucket)

  test('It creates a new Job Runner', () => {
    expect(testRunner.bucket).toBe(testBucket)
  })

  test('It can add a Job to the Runner', () => {
    const testData = { test: true }
    const job = testRunner.add(testData)
    console.log(job)
    expect(job.data).toBe(testData)
  })

  test('It manually stops the runner', () => {
    testRunner.done()
    expect(testRunner._status).toBe(STATUS.done)
  })

  // test('It handles job done', () => {
    // const doneRunner = new Runner('done-bucket')
    // doneRunner.handleJobDone({ data: { time: 0 }})
  // })

})