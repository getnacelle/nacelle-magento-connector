import Store from '../../services/store'

export default async (req, res) => {

  try {
    const { limit } = req.body

    const store = new Store({
      ...req.validatedHeaders,
      ...req.body
    })

    const response = await store.indexProducts(limit)

    return res.status(200).send(response)
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
