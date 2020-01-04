import Magento from '../../../services/magento'

export default async (req, res) => {

  const { cartId } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.getValidatedHeaders()

  if (!cartId || typeof cartId !== 'string') {
    return res.status(400).send('Bad Request')
  }

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const results = await magento.getCart(cartId)

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}
