import Magento from '../../../services/magento'

export default async (req, res) => {

  const { cartId, address } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const results = await magento.estimateShippingMethods(cartId, address)

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}
