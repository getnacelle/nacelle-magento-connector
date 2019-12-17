import request from '../utils/request'

export default class Dilithium {

  constructor(host, spaceId, token) {
    this.clientId = spaceId
    this.clientToken = token
    this.host = host

    this._setConnectorHeaders()
  }

  _setConnectorHeaders() {
    this.headers = {
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

  async save(query, variables) {
    try {
      const url = `${this.host}/${this.clientId}`
      const params = { query, variables }
      return await request(url, 'POST', params, this.headers)
      // return Promise.resolve({ url, method: 'POST', params, headers: this.headers })
    } catch (e) {
      return Promise.reject(e)
    }
  }


}
