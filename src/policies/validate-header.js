import camelCase from '../utils/camel-case'
import config from '../../config/app'

export default (req, res, next) => {
  // validate headers logic
  try {
    const { headers } = req
    const validHeaders = {}
    const missingHeaders = []

    config.router.requiredHeaders.forEach(key => {
      const header = headers[key]
      if(header) {
        validHeaders[camelCase(key)] = header
      } else {
        missingHeaders.push(key)
      }
    })

    if(missingHeaders.length) {
      const missingMsg = missingHeaders.join(', ')
      return res.status(400).send({
        code: 'invalidHeaders',
        error: `Headers are invalid: missing ${missingMsg}`
      })
    }
    req.validatedHeaders = validHeaders
    return next()
  } catch(e) {
    console.log('validate headers: error', e)
    return res.sendStatus(400)
  }

}