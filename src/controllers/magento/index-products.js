import Store from '../../services/store'
import { connector } from '../../../config/app'

export default async (req, res) => {

  try {
    const { limit } = req.body

    const {
      sourceDomain,
      orgId,
      orgToken,
      magentoHost,
      magentoToken
    } = req.validatedHeaders

    connector.jobs.schedule('fetch-products-magento', {
      magentoHost,
      magentoToken,
      orgId,
      orgToken,
      sourceDomain,
      limit
    })

    return res.status(200).send('Indexing in progress!')
  } catch (e) {
    console.log(e)
    return res.status(400).send(e)
  }

}
