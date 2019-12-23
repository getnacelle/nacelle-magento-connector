export const camelCase = (str) => {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, m => m[1].toUpperCase())
}

export const removeTrailing = (str, char) => {
  const regExp = new RegExp(char + '+$');
  return str.replace(regExp, '');
}

export const slugify = (str) => {
  return removeTrailing(str.replace(/[^a-z0-9+]+/gi, '-').toLowerCase(), '-')
}