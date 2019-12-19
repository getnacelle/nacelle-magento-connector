import slugify from '../utils/slugify'

export default ({
  id: cmsSyncSourceContentId,
  identifier,
  title,
  content,
  creation_time: createdAt,
  update_time: updatedAt
}, {
  locale
}) => {

  return {
    handle: slugify(identifier),
    cmsSyncSourceContentId,
    locale,
    type: 'page',
    title,
    content,
    description: content,
    createdAt,
    updatedAt
  }
}
