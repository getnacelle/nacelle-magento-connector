import Job from '../../jobs/job'
import ERRORS from '../../errors'

describe('Job / Internal / Jobs', () => {

  test('It failed to create a new job because it\'s missing a job name', () => {
    try{
      new Job()
    } catch(e) {
      expect(e.message).toEqual(ERRORS.jobNameRequired)
    }
  })

  const jobName = 'job-action'
  const job = new Job(jobName, { test: true })

  test('It fails to import a job action', async () => {
    try {
      await job.importAction()
    } catch(e) {
      expect(e.message).toEqual(ERRORS.importJobActionFailed)
    }
  })

  test('It can import a job action', async () => {
    job.actionPath = '../test/helpers'
    const action = await job.importAction()
    expect(typeof action.fn).toEqual('function')
  })

  test('It can run the job', async () => {
    const finished = await job.run()
    expect(finished.results).toEqual({ test: true })
  })

  test('It fails running a job', async () => {
    const failedJob = new Job(jobName)
    try {
      await failedJob.run()
    } catch(e) {
      expect(e.message).toBeDefined()
    }
  })
})