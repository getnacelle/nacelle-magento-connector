import axios from 'axios';

export default async (url, method, params, headers) => {
  const config = { method, url, data: params, headers };
  if(method === 'GET') {
    config.params = params;
  } else {
    config.data = params;
  }
  return await axios(config);
}
