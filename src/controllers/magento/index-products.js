import Store from '../../services/store'

export default async (req, res) => {

  const jobs = req.app.get('jobs')

  try {
    const { limit } = req.body

    // job will run immediately
    jobs.schedule('fetch-products-magento', {
      limit,
      page: 1,
      config: {
        ...req.validatedHeaders,
        ...req.body
      }
    })

    return res.status(200).send('Indexing in progress!')
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
