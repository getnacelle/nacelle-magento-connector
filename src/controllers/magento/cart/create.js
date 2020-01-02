import generateGuestCart from '../../../helpers/magento/generate-guest-cart'
import updateGuestCart from '../../../helpers/magento/update-guest-cart'

export default async (req, res) => {

  const { items } = req.body

  const {
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  if (!items || !items.length) {
    return res.status(400).send('Bad Request')
  }

  try {

    const { quoteId } = await generateGuestCart({ host: magentoHost, token: magentoToken })
    const results = await updateGuestCart({ host: magentoHost, token: magentoToken, quoteId, items })

    return res.status(200).send({ cartId: quoteId, items: results })
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
