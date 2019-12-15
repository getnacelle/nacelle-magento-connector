export default (app) => {
  const { client, dilithium: config } = app.get('config');
  const utils = app.get('utils')

  return class Dilithium {

    constructor(spaceId, token) {
      this.clientId = spaceId
      this.clientToken = token

      this._setConnectorHeaders()
    }

    _setConnectorHeaders() {
      this.headers = {
        'x-nacelle-token': this.clientToken,
        'org-id': this.clientId,
        'client-name': client
      }
    }

    buildMutation(mutationName, inputType, params) {
      return `mutation ${mutationName}($input: ${inputType}!) {
        ${mutationName}(input: $input) {
          count
          ids
        }
      }`
    }

    async save(query, variables) {
      try {
        const url = `${config.host}/${this.clientId}`
        const params = { query, variables }

        // return await utils.request(url, 'POST', params, headers)
        return Promise.resolve({
          url,
          method: 'POST',
          params,
          headers: this.headers
        })
      } catch (e) {
        return Promise.reject(e);
      }
    }

  }
}
