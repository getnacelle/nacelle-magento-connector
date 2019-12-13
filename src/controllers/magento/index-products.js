import request from '../../utils/request';
import authHeader from '../../utils/auth-header';
import { buildMigration } from '../../services/dilithium';
import normalizer from '../../normalizers/product';

export default async (req, res) => {
  try {
    const url = `${req.headers['magento-endpoint']}/products`;

    const { data } = await request(
      url,
      'GET',
      {
        'searchCriteria[page_size]': 100,
        'searchCriteria[current_page]': 1
      },
      authHeader(req)
    );

    const processed = data.items.map(normalizer);
    // const migration = buildMigration('indexProducts', 'IndexProductsInput', processed);

    return res.status(200).send(processed);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }

}
