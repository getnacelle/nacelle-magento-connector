export const getSeconds = (str) => {
  return new Date(str).getTime() / 1000
}

export default {
  getSeconds
}
