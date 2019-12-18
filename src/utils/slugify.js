import removeTrailing from './remove-trailing'

export default (str) => {
  return removeTrailing(str.replace(/[^a-z0-9+]+/gi, '-').toLowerCase(), '-')
}
