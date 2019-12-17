import express from 'express'
import EventEmitter from 'events'

import appHooks from './hooks'
import policies from './policies'
import router from './router'
import { poweredBy, appLaunched } from './utils' // internal utils
import { port, environment } from '../config/app'

const app = express()
// Set the event bus
const jefferiesTube = new EventEmitter()
app.set('jefferies tube', jefferiesTube)
// env vars
app.set('env', environment)
// Set app configuration
app.enable('strict routing')
app.enable('case sensitive routing')

// load the body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(poweredBy)
// load app hooks
const hooks = appHooks(jefferiesTube)
app.set('hooks', hooks)
// set the middleware policies
policies(app)
// set the routes
router(app)

hooks.waitFor('router:ready', () => {
  app.listen(port, appLaunched(port))
})

hooks.trigger('app:configure')

export default app