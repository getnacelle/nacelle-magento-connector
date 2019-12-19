import slugify from '../utils/slugify'

import { getAttribute } from '../utils/normalizer-helpers'

export default ({
  id: pimSyncSourceCollectionId,
  name,
  custom_attributes: attributes
}, {
  locale,
  mediaUrl
}) => {
  // create new collection object
  const collection = {
    pimSyncSourceCollectionId,
    handle: slugify(name),
    title: name,
    locale,
    productLists: []
  }

  const description = getAttribute(attributes, 'description')
  if(description) {
    collection.description = description
  }

  const image = getAttribute(attributes, 'image')
  if(image) {
    const src = `${mediaUrl}catalog/category/${image}`
    const featuredMedia = {
      src,
      thumbnailSrc: src,
      type: 'image'
    }
    collection.featuredMedia = featuredMedia
  }

  return collection
}
