export default (req, res, next) => {
  try {
    // validate headers logic
    return next();
  } catch(e) {
    return res.sendStatus(400)
  }

}
