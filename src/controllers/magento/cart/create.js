import Magento from '../../../services/magento'
import updateGuestCart from '../../../helpers/magento/update-guest-cart'

export default async (req, res) => {

  const { items } = req.body

  const {
    magentoHost,
    magentoToken
  } = req.getValidatedHeaders()

  try {
    const magento = new Magento(magentoHost, magentoToken)

    const cartId = await magento.createCart()
    if(items && items.length) {
      // if items are passed add them to the cart
      await updateGuestCart({ host: magentoHost, token: magentoToken, cartId, items })
    }

    return res.status(201).send(cartId)
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
