import slugify from '../utils/slugify'
import stripNullEmpty from '../utils/strip-null-empty'

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
  // create a new object
  const product = {
    locale: 'en-us',
    pimSyncSourceProductId,
    handle: slugify(name),
    title: name,
    productType,
    availableForSale: Boolean(status),
    priceRange: {
      min: price.toString(),
      max: price.toString(),
      currencyCode: 'USD' // TODO: get from app config
    },
    createdAt
  }

  const descriptionField = meta.find(x => x.attribute_code === 'description')
  if (descriptionField) {
    product.description = JSON.stringify(descriptionField.value)
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
    const [featuredMedia, ...additionalMedia] = media.sort((a, b) => b.position - a.position)
    product.featuredMedia = {
      id: featuredMedia.id,
      src: featuredMedia.file,
      thumbnailSrc: featuredMedia.file,
      type: featuredMedia.media_type
    }

    if (additionalMedia) {
      product.media = additionalMedia.map(item => ({
        id: item.id,
        src: item.file,
        thumbnailSrc: item.file,
        type: item.media_type
      }))
    }
  }

  if (attributes.configurable_product_options) {
    product.variants = attributes.configurable_product_options.map(item => ({
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
    }))
  }

  return product
}
