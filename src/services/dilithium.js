export default (app) => {
  const { client, dilithium: config } = app.get('config')
  const utils = app.get('utils')

  return class Dilithium {

    constructor(spaceId, token) {
      this.clientId = spaceId
      this.clientToken = token
      this.host = config.host

      this._setConnectorHeaders()
    }

    _setConnectorHeaders() {
      this.headers = {
        'x-nacelle-token': this.clientToken,
        'org-id': this.clientId,
        'client-name': client
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

    async save(params) {
      try {
        const url = `${this.host}/${this.clientId}`

        // return await utils.request(url, 'POST', params, this.headers)
        return Promise.resolve({ url, method: 'POST', params, headers: this.headers })
      } catch (e) {
        return Promise.reject(e)
      }
    }

  }
}
