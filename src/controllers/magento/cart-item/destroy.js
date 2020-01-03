import Magento from '../../../services/magento'
import cartRemoveItem from '../../../helpers/magento/cart-remove-item'

export default async (req, res) => {

  const { id: quoteId, itemId } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  try {
    const result = await cartRemoveItem({ host: magentoHost, token: magentoToken, quoteId, itemId })

    return res.status(200).send(result)
  } catch (e) {
    return res.status(400).send(e)
  }

}
