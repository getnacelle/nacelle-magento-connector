import slugify from '../utils/slugify'
import stripNullEmpty from '../utils/strip-null-empty'

import { getAttribute } from '../utils/normalizer-helpers'

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
}, {
  locale,
  currencyCode,
  staticUrl
}) => {
  // create a new object
  const product = {
    locale,
    pimSyncSourceProductId,
    handle: slugify(name),
    title: name,
    productType,
    availableForSale: Boolean(status),
    priceRange: {
      min: price.toString(),
      max: price.toString(),
      currencyCode: currencyCode
    },
    createdAt
  }

  if (attributes.length) {
    const description = getAttribute(attributes, 'description')
    if (description) {
      product.description = JSON.stringify(description)
    }
  }

  const metafields = meta
    .filter(x => x.attribute_code !== 'description')
    .map(({ attribute_code: key, value }) => ({
      namespace: '',
      key,
      value
    }))
  if (metafields.length) {
    product.metafields
  }

  if (media.length) {
    const _media = media.map(item => ({
      id: item.id,
      src: `${staticUrl}${item.file}`,
      thumbnailSrc: `${staticUrl}${item.file}`,
      type: item.media_type
    }))

    product.featuredMedia = _media[0]
    product.media = _media
  }

  if (attributes.configurable_product_options) {
    product.variants = attributes.configurable_product_options.map(item => ({
      id: item.id,
      title: item.label,
      availableForSale: Boolean(status),
      price,
      priceCurrency: currencyCode
    }))
  }

  return product
}
