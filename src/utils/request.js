import axios from 'axios'
// set the axios global headers to support json
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default async (url, method, params, headers) => {

  const options = { method, url, headers }
  if (params) {
    if (method === 'GET') {
      options.params = params
    } else {
      options.data = params
    }
  }

  try {
    const { data, errors } = await axios(options)
    // Catch errors just in case a proper error response code is not provided in response
    if (errors && errors.length) {
      return Promise.reject(errors)
    }
    return data
  } catch ({ response }) {
    return Promise.reject(response.data)
  }

}
