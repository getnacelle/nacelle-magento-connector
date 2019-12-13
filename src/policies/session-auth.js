export default async (req, res, next) => {
  try {
    // Validate auth token logic
    return next();
  } catch(e) {
    return res.sendStatus(403);
  }
}