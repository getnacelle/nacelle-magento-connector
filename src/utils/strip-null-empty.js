export default (object) => {
  return Object.keys(object).reduce((output, attribute) => {
    const value = object[attribute];
    if (typeof value === 'string' && value) {
      output[attribute] = value;
    } else if (typeof value === 'object' && Object.keys(value).length) {
      output[attribute] = value;
    } else if (Array.isArray(value) && value.length) {
      output[attribute] = value
    }

    return output;
  }, {})
}
