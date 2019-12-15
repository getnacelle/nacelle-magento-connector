export default (str) => {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, m => m[1].toUpperCase())
}
