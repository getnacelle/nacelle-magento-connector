export default async (req, res, next) => {
  try {
    // Validate auth token logic
    console.log('session-auth');
    // return res.sendStatus(401);
    return next();
  } catch(e) {
    return res.sendStatus(403);
  }
}