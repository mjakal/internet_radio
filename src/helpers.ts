export const truncateString = (str: string = '', maxLength: number = 0, defaultStr: string = '') => {
  if (!str) return defaultStr;

  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};