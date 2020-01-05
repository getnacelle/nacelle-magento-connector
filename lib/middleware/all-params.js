export default (req, res, next) => {
  req.allParams = () => {
    return { ...req.params, ...req.body }
  }
  next()
}
