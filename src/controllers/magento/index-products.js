import Store from '../../services/store'

export default async (req, res) => {

  const logger = req.app.get('logger')

  try {
    const { limit } = req.body

    const store = new Store({
      ...req.validatedHeaders,
      ...req.body
    })

    const response = await store.indexProducts(limit)

    return res.status(200).send('Indexing in progress!')
  } catch (e) {
    logger.error(e)
    return res.status(400).send(e)
  }

}
