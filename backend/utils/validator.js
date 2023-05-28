export default {
  isValidStr(str) {
    if (!str || str.toString().length === 0) {
      return false;
    }
    return true;
  },
};
