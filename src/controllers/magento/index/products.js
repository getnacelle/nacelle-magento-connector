import { connector } from '../../../../config/app'

export default async (req, res) => {

  try {
    const { limit } = req.body
    // Explicitly select the params we want to use from the validatedHeaders object
    const {
      sourceDomain,
      orgId,
      orgToken,
      magentoHost,
      magentoToken
    } = req.validatedHeaders

    // Schedule a jobe to run immediately to fetch the Magento Products concurrently
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
    return res.status(400).send(e)
  }

}
