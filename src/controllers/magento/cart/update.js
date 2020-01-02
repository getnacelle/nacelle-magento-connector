import Magento from '../../../services/magento'
import updateGuestCart from '../../../helpers/magento/update-guest-cart'

export default async (req, res) => {

  const { id: quoteId, items } = req.allParams()

  const {
    sourceDomain,
    orgId,
    orgToken,
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  if (!quoteId || typeof quoteId !== 'string' || !items || !items.length) {
    return res.status(400).send('Bad Request')
  }

  try {
    const results = await updateGuestCart({ host: magentoHost, token: magentoToken, quoteId, items })

    return res.status(200).send({ cartId: quoteId, items: results })
  } catch (e) {
    return res.status(400).send(e)
  }

}
