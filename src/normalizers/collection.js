import slugify from '../utils/slugify'
import stripNullEmpty from '../utils/strip-null-empty'

export default ({
  id: pimSyncSourceCollectionId,
  name

}) => {
  const collection = {
    pimSyncSourceCollectionId,
    handle: slugify(name),
    title: name,
    description: '',
    featuredMedia: {},
    products: []
  }

  return stripNullEmpty(collection)
}
