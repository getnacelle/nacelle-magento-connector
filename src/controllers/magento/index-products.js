import authHeader from '../../utils/auth-header';
import normalizer from '../../normalizers/product';

export default async (req, res) => {
  const {
    Dilithium,
    Magento
  } = req.app.get('services')

  const {
    dilithium: config
  } = req.app.get('config');

  try {
    const {
      orgId,
      orgToken,
      pimSyncSourceDomain,
      magentoToken,
      magentoEndpoint
    } = req.validatedHeaders

    const {
      limit = 1,
      defaultLocale = config.locale,
      defaultCurrencyCode = config.currencyCode
    } = req.params;

    const options = {
      limit,
      page: 1
    }

    const magento = new Magento(magentoEndpoint, magentoToken);
    const dilithium = new Dilithium(orgId, orgToken)

    // get all of the products from Magento store
    const data = await magento.getProducts(options, authHeader(req))
    // normalize the data for indexing
    const normalizedData = data.items.map(normalizer)
    // build GraphQL mutation
    const query = dilithium.buildMutation('indexProducts', 'IndexProductsInput')
    const variables = {
      input: {
        pim: {
          syncSource: config.syncSource,
          syncSourceDomain: pimSyncSourceDomain,
          defaultLocale
        },
        products: normalizedData
      }
    };
    const response = await dilithium.save(query, variables)

    return res.status(200).send(response);
  } catch (e) {
    return res.status(400).send(e);
  }

}
