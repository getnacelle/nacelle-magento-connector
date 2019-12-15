export const poweredBy = (req, res, next) => {
  res.set('X-Powered-By', 'USS Enterprise NCC-1701')
  next()
}

export const appLaunched = (port) => {
  console.log('Listening on port %s', port)
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
