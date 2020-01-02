import Magento from '../../../services/magento'

export default async (req, res) => {

  const { id: quoteId } = req.allParams()

  const {
    magentoHost,
    magentoToken
  } = req.validatedHeaders

  if (!quoteId || typeof quoteId !== 'string') {
    return res.status(400).send('Bad Request')
  }

  try {
    const magento = new Magento(magentoHost, magentoToken)
    const results = await magento.getGuestCart(quoteId)

    return res.status(200).send(results)
  } catch (e) {
    return res.status(400).send(e)
  }

}
