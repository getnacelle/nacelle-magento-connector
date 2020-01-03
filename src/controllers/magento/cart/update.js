import updateGuestCart from '../../../helpers/magento/update-guest-cart'

export default async (req, res) => {

  const { cartId, items } = req.allParams()

  const {
    sourceDomain,
    orgId,
    orgToken,
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  if (!cartId || typeof cartId !== 'string' || !items || !items.length) {
    return res.status(400).send('Bad Request')
  }

  try {
    const results = await updateGuestCart({ host: magentoHost, token: magentoToken, cartId, items })

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}
