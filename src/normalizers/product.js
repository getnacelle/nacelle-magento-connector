import slugify from '../utils/slugify';

export default ({
  id: pimSyncSourceProductId,
  name,
  attribute_set_id: collection,
  status,
  price,
  type_id: productType,
  custom_attributes: meta,
  media_gallery_entries: media,
  extension_attributes: attributes,
  created_at: createdAt
}) => {
  const descriptionField = meta.find(x => x.attribute_code === 'description');
  const metafields = meta
    .filter(x => x.attribute_code !== 'description')
    .map(({ attribute_code: key, value }) => ({
      namespace: '',
      key,
      value
    }));

  const priceRange = {
    min: price,
    max: price,
    currencycode: 'USD' // TODO: get from app config
  };

  const [_featuredMedia, ...additionalMedia] = media.sort((a, b) => b.position - a.position);
  const featuredMedia = {
    id: _featuredMedia.id,
    src: _featuredMedia.file,
    thumbnailSrc: _featuredMedia.file,
    type: _featuredMedia.media_type
  };

  const _media = additionalMedia && additionalMedia.length ? additionalMedia.map(item => ({
    id: item.id,
    src: item.file,
    thumbnailSrc: item.file,
    type: item.media_type
  })) : [];

  const variants = attributes.configurable_product_options ? attributes.configurable_product_options.map(item => ({
    id: item.id,
    title: item.label,
    availableForSale: Boolean(status),
    price,
    priceCurrency: 'USD', // TODO: get from app config
    // featuredMedia: {
    //   id: ,
    //   type: 'image',
    //   src: '',
    //   thumbnailSrc: '',
    //   altText: '',
    //   sku: ''
    // }
  })) : [];
  // console.log(productVariations);

  const product = {
    local: 'en-us',
    pimSyncSourceProductId,
    handle: slugify(name),
    title: name,
    description: descriptionField ? descriptionField.value : '',
    content: '',
    priceRange: [],
    productType,
    featuredMedia,
    availableForSale: Boolean(status),
    vendor: '',
    tags: [],
    options: [],
    media: _media,
    metafields,
    variants,
    createdAt
  };

  return Object.keys.filter(x => !!product[x]).reduce((o, i) => {
    o[i] = product[i];
    return o;
  }, {});

}
