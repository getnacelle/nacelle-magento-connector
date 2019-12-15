import express from 'express'
import axios from 'axios'

import services from './services'
import policies from './policies'
import router from './router'
import { poweredBy, appLaunched } from './utils' // internal utils
import config, { port, environment } from '../config/app'

import ajaxRequest from '../src/utils/request'

const app = express()
app.set('env', environment)
// Set app configuration
app.enable('strict routing')
app.enable('case sensitive routing')

app.set('config', config)

// set the axios global headers to support json
axios.defaults.headers.post['Content-Type'] = 'application/json'
// inject axios into app via app.get('ajax')
app.set('ajax', axios)

// assign some app wide utils
const utils = {
  // import the request util for use throughout the app via app.get('utils').request
  request: ajaxRequest(app)
}
app.set('utils', utils)
// inject services into app
services(app)
// set the middleware policies
policies(app)
// load the body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// set the routes
router(app)

app.use(poweredBy)
app.listen(port, appLaunched(port))

export default app
