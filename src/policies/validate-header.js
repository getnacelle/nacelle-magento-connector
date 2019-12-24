import { camelCase } from '../utils/string-helpers'
import config, { app } from '../../config/app'

const hasConfigRequiredHeaders = config.router.requiredHeaders && Object.keys(config.router.requiredHeaders).length

export default (req, res, next) => {
  // const app = config.app
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

  try {
    const requiredHeaders = app.router.getRequiredHeaders(routeKey)
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
    req.validatedHeaders = validHeaders
    return next()
  } catch (e) {
    console.log('validate headers: error', e)
    return res.sendStatus(400)
  }

}
