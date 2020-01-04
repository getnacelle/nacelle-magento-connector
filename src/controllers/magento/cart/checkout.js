import Magento from '../../../services/magento'

export default async (req, res) => {

  const { cartId } = req.params

  const {
    magentoHost,
    magentoToken
  } = req.getValidatedHeaders()

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const results = await magento.createOrder(cartId, req.body)

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}