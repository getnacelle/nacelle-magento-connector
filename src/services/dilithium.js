import request from '../utils/request'
import appConfig from '../../config/app'

export default class Dilithium {

  constructor(domain, spaceId, token) {
    this.clientId = spaceId
    this.clientToken = token
    this.host = appConfig.dilithium.host
    this.domain = domain
    this.locale = 'en-us'
  }

  get authHeader() {
    return {
      'org-id': this.clientId,
      token: this.clientToken
    }
  }

  buildMutation(mutationName, inputType) {
    return `mutation ${mutationName}($input: ${inputType}!) {
      ${mutationName}(input: $input) {
        count
        ids
      }
    }`
  }

  buildQuery(ref, type, data, mutationName, inputType) {
    const query = this.buildMutation(mutationName, inputType)
    const variables = {
      input: {
        [ref]: {
          syncSource: 'magento',
          syncSourceDomain: this.domain,
          defaultLocale: this.locale
        },
        [type]: data
      }
    }
    return [query, variables]
  }

  async save(query, variables) {
    try {
      const url = `${this.host}/${this.clientId}`
      const params = { query, variables }
      return await request(url, 'POST', params, this.authHeader)
    } catch (e) {
      return Promise.reject(e)
    }
  }


}
