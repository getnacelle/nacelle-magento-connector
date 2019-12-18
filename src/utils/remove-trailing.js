export default (str, char) => {
  const regExp = new RegExp(char + '+$');
  return str.replace(regExp, '');
}
