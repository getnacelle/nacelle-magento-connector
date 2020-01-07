# Jobs

The Jobs Queue consists of three parts; Job Manager, Runner, and Job. Jobs are actions that run outside of the Main Event scope, and are not waited on for response. Think of them as shoot and move on. You will be notified in your Nacelle Dashboard of Job Status and Completion.

## Schedule a Job

By default the wait for a new Job is `0`

`Job Name`: String name representing the job. Name must match Job filename of action to run.

`Data`: Object of data to pass to Job

```js
/**
 * Schedule a new Job
 * @param {string} action The name of the Job to run
 * @param {object} data The data required to process the Job
 * @param {object} options The Job options - optional, wait defaults to 0
 *
 * @return {Job}
 */
function schedule(action, data, options){
  // internal job registration and execution
}


jobs.schedule('fetch-magento-products', {
  magentoHost: 'http://local.magento/rest/all/V1',
  magentoToken: '4qu2rdczvgxzk4cg05wo89g1rt5lj5gd',
  orgId: 'c88690c8-4366-44e3-45ac-eca27cd6e6a6',
  orgToken: 'et7a665a-318c-a13f-b274-17170bc89d4',
  sourceDomain: 'magentodemo.getnacelle.com',
  limit: 300
})
```

## Job Action


```js
export default {

  friendlyName: 'Fetch Products Magento',

  description: 'Fetch Products from Magento Store',

  inputs: {
    magentoHost: {
      type: 'string',
      description: 'Magento API host',
      required: true
    },
    magentoToken: {
      type: 'string',
      description: 'Magento API access token',
      required: true
    },
    orgId: {
      type: 'string',
      description: 'Nacelle Organization ID',
      required: true
    },
    orgToken: {
      type: 'string',
      description: 'Nacelle Organization access token',
      required: true
    },
    sourceDomain: {
      type: 'string',
      description: 'Magento source sync domain',
      required: true
    },
    limit: {
      type: 'number',
      description: 'Limit to fetch products',
      defaultsTo: 300
    },
    secure: {
      type: 'boolean',
      description: 'Set http or https protocol',
      defaultsTo: false
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn({
    magentoHost,
    magentoToken,
    orgId,
    orgToken,
    sourceDomain,
    limit,
    secure
  }, exits) {
    try {
      const magento = new Magento(magentoHost, magentoToken)
      // Initial fetch, retrieve Magento store config and products
      // these will run concurrently
      const promises = [
        magento.getStoreConfig(secure),
        helper({ host: magento.host, token: magento.token, type: 'products', limit })
      ]
      // assign store config and products response
      const [storeConfig, products] = await Promise.all(promises)

      const items = products.map(product => normalizer(product, { staticUrl: storeConfig.staticUrl, locale: storeConfig.locale, currencyCode: storeConfig.currencyCode }))

      // offload the dilithium push to the jobs queue
      connector.jobs.schedule('push-dilithium', {
        items,
        sourceDomain,
        orgId,
        orgToken,
        resource: 'products',
        type: 'pim'
      })

      return exits.success(items)
    } catch (e) {
      return exits.error(new Error(e))
    }

  }
}

```