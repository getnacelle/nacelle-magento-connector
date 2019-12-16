import authHeader from '../../utils/auth-header'

export default async (req, res) => {

  const { Store } = req.app.get('services')

  try {
    const { limit } = req.body

    const store = new Store({
      ...req.validatedHeaders,
      ...req.body,
      authHeader: authHeader(req)
    })

    const response = await store.indexProducts(limit)

    return res.status(200).send(response)
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
