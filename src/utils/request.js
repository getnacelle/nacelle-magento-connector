export default (app) => async (url, method, params, headers) => {
  const ajax = app.get('ajax')

  const options = { method, url, headers }
  if (params) {
    if (method === 'GET') {
      options.params = params
    } else {
      options.data = params
    }
  }

  try {
    const { data } = await ajax(options)
    return data
  } catch ({ response }) {
    return Promise.reject(response.data)
  }

}
