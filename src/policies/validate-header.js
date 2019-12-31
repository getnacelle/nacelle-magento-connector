import { camelCase } from '../utils/string-helpers'
import config, { connector } from '../../config/app'

const hasConfigRequiredHeaders = config.router.requiredHeaders && Object.keys(config.router.requiredHeaders).length

/**
 * Validated the required headers middleware
 * @params {object} req
 * @params {object} res
 * @params {function} next
 */
export default (req, res, next) => {
  // validate headers logic
  const validHeaders = {}
  const missingHeaders = []
  const routeKey = `${req.method} ${req.url}`

  const validateHeaders = (headers) => {
    headers.forEach(key => {
      const header = req.headers[key]
      if (header && typeof header === 'string') {
        validHeaders[camelCase(key)] = header
      } else {
        missingHeaders.push(key)
      }
    })
  }

  // route required headers
  const requiredHeaders = connector.router.getRequiredHeaders(routeKey)
  if (requiredHeaders) {
    validateHeaders(requiredHeaders)
  } else if (hasConfigRequiredHeaders) {
    validateHeaders(config.router.requiredHeaders)
  }

  if (missingHeaders.length) {
    const missingMsg = missingHeaders.join(', ')
    return res.status(400).send({
      code: 'invalidHeaders',
      error: `Headers are invalid: missing ${missingMsg}`
    })
  }
  // add the validated headers to the req object
  req.validatedHeaders = validHeaders

  return next()
}
