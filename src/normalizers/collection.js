import slugify from '../utils/slugify'
import stripNullEmpty from '../utils/strip-null-empty'

import { getAttribute } from '../utils/normalizer-helpers'

export default ({
  id: pimSyncSourceCollectionId,
  name,
  custom_attributes: attributes
}, config) => {
  // create new collection object
  const collection = {
    pimSyncSourceCollectionId,
    handle: slugify(name),
    title: name,
    locale: config.locale,
    productLists: []
  }

  const description = getAttribute(attributes, 'description')
  if(description) {
    collection.description = description
  }

  const image = getAttribute(attributes, 'image')
  if(image) {
    const src = `${config.mediaUrl}catalog/category/${image}`
    const featuredMedia = {
      src,
      thumbnailSrc: src,
      type: 'image'
    }
    collection.featuredMedia = featuredMedia
  }

  return collection
}
