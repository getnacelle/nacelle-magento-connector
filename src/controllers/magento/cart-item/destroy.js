import Magento from '../../../services/magento'

export default async (req, res) => {

  const { cartId, itemId } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const result = await magento.cartRemoveItem(cartId, itemId)

    return res.status(200).send(result)
  } catch (e) {
    return res.status(400).send(e)
  }

}
