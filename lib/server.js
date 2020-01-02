import express from 'express'

import initializer from './initializer'
import Hooks from './hooks'
import policies from './policies'
import Router from './router'
import jobQueue from './jobs'
import cacheManager from './cache'
import logger from './logger'
import { port, disableXPoweredBy } from '../config/app'

import EVENTS from './events'

const poweredBy = (req, res, next) => {
  res.set('X-Powered-By', 'USS Enterprise NCC-1701')
  next()
}

const environment = process.env.NODE_ENV

const app = express()
app.use((req, res, next) => {
  req.allParams = () => {
    return { ...req.params, ...req.body }
  }
  next()
})
// load app hooks
const hooks = Hooks(app)
// env vars
app.set('env', environment)
// Set app configuration
app.enable('strict routing')
app.enable('case sensitive routing')

// load the body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (disableXPoweredBy) {
  app.disable('x-powered-by')
} else {
  app.use(poweredBy)
}

const jobs = jobQueue(hooks)
app.set('hooks', hooks)
// ready the initializer
initializer(app)
// set the middleware policies
policies(app)
// set the routes
const router = Router(app)

hooks.waitFor(EVENTS.routerReady, () => {
  app.listen(port, logger.info('Listening on port %s', port))
})

// do not automatically configure the connector if in test
if (environment !== 'test') {
  hooks.trigger(EVENTS.appConfigure)
}

const cache = cacheManager()

// expose app services
export default {
  hooks,
  jobs,
  cache,
  router,
  logger
}
