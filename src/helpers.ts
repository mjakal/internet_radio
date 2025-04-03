export const objectHasData = (dataObject = {}) => {
  if (!dataObject || !(dataObject instanceof Object)) return false;

  if (!Object.keys(dataObject).length) return false;

  return true;
};

export const truncateString = (str = '', maxLength = 0, defaultStr = '') => {
  if (!str) return defaultStr;

  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};