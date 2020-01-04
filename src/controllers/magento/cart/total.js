import Magento from '../../../services/magento'

export default async (req, res) => {

  const { cartId, addressInformation } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.getValidatedHeaders()

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const results = await magento.setCartInfo(cartId, { addressInformation })

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}
