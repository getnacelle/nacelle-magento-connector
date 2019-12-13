import axios from 'axios';
import pkg from '../package.json';
import policies from './policies';
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_PORT = 3000;

export default (app) => {

  axios.defaults.headers.post['Content-Type'] = 'application/json';
  app.set('ajax', axios);

  const {
    PORT = DEFAULT_PORT,
    NODE_ENV = 'development',
    MAGENTO_CLIENT_ID = '',
    MAGENT_ACCESS_TOKEN = '',
    MAGENTO_CLIENT_SECRET = '',
    NACELLE_SPACE_ID = '',
    STARFLEET_APPSYNC_ENDPOINT,
    STARFLEET_APPSYNC_KEY
  } = process.env;

  app.set('config', {
    appName: pkg.name,
    environment: NODE_ENV,
    port: PORT,
    magentoClientId: MAGENTO_CLIENT_ID,
    magentoClientSecret: MAGENTO_CLIENT_SECRET,
    magentoAccessToken: MAGENT_ACCESS_TOKEN,
    spaceId: NACELLE_SPACE_ID,
    starfleetEndpoint: STARFLEET_APPSYNC_ENDPOINT,
    srarfleetKey: STARFLEET_APPSYNC_KEY,

    security: {
      allowedOptions: ['POST', 'GET', 'PUT', 'DELETE']
    },
    router: {
      policies
    }
  });

}
