import Store from '../../services/store'

export default async (req, res) => {

  const logger = req.app.get('logger')

  try {
    const {
      limit = 100,
      page = 1
    } = req.body

    const store = new Store({
      ...req.validatedHeaders,
      ...req.body
    })

    const response = await store.indexCollections({ limit, page })

    return res.status(200).send(response)
  } catch (e) {
    logger.error(e)
    return res.status(400).send(e)
  }

}
